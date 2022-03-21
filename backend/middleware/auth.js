const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("./catchAsyncError");
const jwt = require('jsonwebtoken');
const User = require("../models/userModels");


exports.isAuthenticatedUser = catchAsyncError( async(req,res,next)=>{
    const {token} = req.cookies;
    
    if(!token){
        return next(new ErrorHandler("please login to access the resources",401))
    }
    const decodeData = jwt.verify(token,process.env.JWT_SECRET);

   req.user = await User.findById(decodeData.id);

   next();
})


exports.authorisedRole = (...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(
                new ErrorHandler(`Role :${req.user.role} ,is not access to the resource`,403)
            )
        }
        next();
    };
};