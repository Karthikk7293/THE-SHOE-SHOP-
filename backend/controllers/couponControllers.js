// const Order = require("../models/orderModels");
// const Product = require("../models/productModels");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const Coupon = require("../models/couponModel");

//  create coupon

exports.createCoupon = catchAsyncErrors(async (req, res, next) => {
//   console.log(req.body, "coupon arrived-----------------");

  const { startDate, endDate, coupon, discount } = req.body;

  const data = await Coupon.create({ startDate, endDate, coupon, discount });

  res.status(201).json({
    success: true,
    data,
  });
});

// get all coupons

exports.getAllCoupons = catchAsyncErrors(async (req, res, next) => {
  const coupons = await Coupon.find();

  res.status(201).json({
    success: true,
    coupons,
  });
});

// add user to the coupon while using the coupon

exports.addUserToCoupon = catchAsyncErrors(async (req, res, next) => {
//   console.log(req.body, "user araived");
});

// delete coupon

exports.deleteCoupon = catchAsyncErrors(async (req, res, next) => {
  // console.log(req.params.id,"body arived");

  const coupon = await Coupon.findById(req.params.id);

  if (!coupon) return next(new ErrorHandler("Sorry !  Coupon not found !", 404));

    await coupon.deleteOne();

  return res.status(200).json({
    success: true,
    message: "Coupon Delete Successfully !",
  });
});
