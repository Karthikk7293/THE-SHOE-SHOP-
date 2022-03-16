const Product = require('../models/productModels')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncError')
const ApiFeatures = require('../utils/apifeatures')
const cloudinary = require("cloudinary")



// Create Product

exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    let images = [];

    if (typeof req.body.images === "string") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }
  
    const imagesLinks = [];
  
    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });
  
      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }
  
    req.body.image = imagesLinks;
    req.body.user = req.user.id;
let product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})

// get single Product

exports.getProductDetials = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id)
    if (!product) return next(new ErrorHandler("Product Not Found !", 404))

    res.status(200).json({
        success: true,
        product
        
    })
})


// get all product

exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultPerPage = 8;
    const productsCount = await Product.countDocuments()
    const ApiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pagenation(resultPerPage)
    let products = await ApiFeature.query;

    res.status(200).json({
        status: true,
        products,
        productsCount
    })
})


// update product

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {

    let product = await Product.findById(req.params.id)

    if (!product) return next(new ErrorHandler("Product Not Found !", 404))

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    })
})


// delete Product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    let product = Product.findById(req.params.id)
    if (!product) return next(new ErrorHandler("Product Not Found !", 404))

    await product.deleteOne();

    return res.status(200).json({
        success: true,
        message: "Product Delete Successfully"
    })
})


// Create New Review or Update the Review

exports.createProductReview = catchAsyncErrors(async (req, res, next) => {

    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);
    const isReviewed = product.review.find((rev) => rev.user.toString() === req.user._id.toString())


    if (isReviewed) {
        product.review.forEach((rev) => {

            if ( rev.user.toString() === req.user._id.toString())
                (rev.rating = rating),(rev.comment = comment)

        })
    } else {

        product.review.push(review);
        product.numOfReviews = product.review.length
    }
    let avg = 0;

    product.review.forEach((rev) => {
        avg += rev.rating;
    })

    product.rating = avg / product.review.length;

    await product.save({ validateBeforeSave: false })

    res.status(200).json({
        success: true,
        message: "Thanks for Your Valuable Review !"
    })

});

// get all reviews of a single product

exports.getProductReviews = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.id)

    if (!product) return next(new ErrorHandler("Product not found !", 404))


    res.status(200).json({
        success: true,
        reviews: product.review
    })
})

// Delete Reviews

exports.DeleteReview = catchAsyncErrors(async (req, res, next) => {

    const product = await Product.findById(req.query.productId)
    
    if (!product) {return next(new ErrorHandler("Product not found !", 404))}


    const review = product.review.filter(
        (rev) => {rev._id.toString() !== req.query.id.toString()}
    );

    let avg = 0;

    review.forEach((rev) => {avg += rev.rating});

    const rating = avg / review.length;

    const numOfReviews = review.length;

    await Product.findByIdAndUpdate(req.query.productId,
        { rating, review, numOfReviews },
        { new: true, runValidators: true, useFindAndModify: false })

    res.status(200).json({
        success: true
    })
})