const mongoose = require("mongoose");


const couponSchema = mongoose.Schema({

    startDate:{
        type:Date,
        required:[true,"Please Enter the Starting date"]
    },
    endDate:{
        type:Date,
        required:[true,"Please Enter the End date"]
    },
    coupon:{
        type:String,
        required:[true,"Please Enter the Coupon Code !" ]
    },
    discount:{
        type:Number,
        required:[true ,"Please Enter the Discount Amount in Persentage !"]
    },
    users:[
        {
            
          type:mongoose.Schema.ObjectId,
          ref:"user",
        }
    ]

})


module.exports = mongoose.model("coupon",couponSchema)