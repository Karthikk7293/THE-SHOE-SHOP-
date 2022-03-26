const Order = require("../models/orderModels")
const Product = require('../models/productModels')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncError')


// Create new Order

exports.newOrder = catchAsyncErrors(async(req,res,next)=>{
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice

    } = req.body;


    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    })

    res.status(201).json({
        success:true,
        order
    })
});

// get sigle order  

exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id).populate("user","fname email ");

    if(!order) return next(new ErrorHandler("Order not Found",404))


    res.status(200).json({
        success:true,
        order
    })
})

// get logged in user order  

exports.myOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders = await Order.find({user:req.user._id})

    res.status(200).json({
        success:true,
        orders
    })
})

// get all orders (Admin)

exports.GetAllOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders = await Order.find();

    let totalAmount = 0;
    orders.forEach(order=> totalAmount+=order.totalPrice )

    res.status(200).json({
        success:true,
        orders,
        totalAmount
    })
})

// update order status

exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{

   try {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus === "Delivered") return next(new ErrorHandler("You Have Already Delivered This Order !",400))

    order.orderItems.forEach(async(ord) =>{
        await updateStock(ord.product,ord.quantity)
    })

    order.orderStatus = req.body.status;

    if(req.body.status === "Delivered") order.deliveredAt = Date.now();

    await order.save({validateBeforeSave:false})
       
   } catch (error) {
       console.log(error);
   }


    res.status(200).json({
        success:true,
       
    })
})


 const updateStock = async(id,quantity)=>{
const product = await Product.findById(id)

// console.log(id,quantity,"-------------------");
product.stock -= quantity;

await product.save({validateBeforeSave:false})
}


// Delete orders (Admin)

exports.deleteOrder = catchAsyncErrors(async(req,res,next)=>{

    const order = await Order.findById(req.params.id);

    if(!order) return next(new ErrorHandler("Order is not found !",401))

    await order.remove();

    res.status(200).json({
        success:true,
      
    })
})