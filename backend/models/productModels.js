const mongoose = require("mongoose")


const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please Enter The Name!"],
        trim: true
    },
    brand: {
        type: String,
        required: [true, "Please Enter The Brand Name!"]
    },
    size: {
        type: Number,
        required: [true, "Please Enter The Size!"]
    },
    price: {
        type: Number,
        required: [true, "Please Enter The Price!"],
        maxLength: [5, "Price Cannot Exeed 5 Digits!"]
    },
    description: {
        type: String,
        required: [true, "Please Enter The Description!"]
    },
    category: {
        type: String,
        required: [true, "Please Enter Select The Category!"]
    },
    image: [
        {
            public_id: {
                type: String,
                required: [true, "Please Choose The Image!"]
            },
            url: {
                type: String,
                required: true
            }
        }

    ],
    rating: {
        type: Number,
        default: 0
    },

    stock:{
        type:Number,
        required:[true,"Please Enter Stock!"],
        maxLength:[4,"Stock Cannot Exeed 4 Digits!"],
        default:1
    },
    numOfReviews:{
        type:String,
        default:0
    },
    review:[
        {
            user:{
                type:mongoose.Schema.ObjectId,
                ref:"user",
                required:true
            },
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
                type:String,
                required:true
            }
        }

    ],

    user:{
        type:mongoose.Schema.ObjectId,
        ref:"user",
        required:true
    },

     createdAt:{
        type:Date,
        default: Date.now
    }

})

module.exports =mongoose.model("product",productSchema)