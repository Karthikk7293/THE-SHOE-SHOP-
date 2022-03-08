const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto")

const userSchema = mongoose.Schema({
    fname:{
        type:String,
        required:[true,"Please enter your name !"],
        maxLenght:[20,"Name cannot exeed 30 character"],
        minLenght:[4,"Name should than more 4 characters"]
    },
    lname:{
        type:String,
        required:[true,"Please enter your name !"],
        maxLenght:[10,"Name cannot exeed 30 character"]
    },
    phone:{
        type:Number,
        required:[true,"Please enter the phone number !"],
        minLenght:[10,"Name should than more 10 characters"],
        unique:true
    },
    gender:{
        type:String,
        default:""
    },
    Address:[
        {
            type:String,
            default:""
        }
    ],
    email:{
        type:String,
        required:[true,"Please enter your email !"],
        unique:true,
        validate:[validator.isEmail,"Please enter a valid Email"]
    },
    password:{
        type:String,
        required:[true,"Please enter your Password !"],
        minLenght:[6,"Password must be 6 characters"]
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }

    },
    role:{
        type:String,
        default:"user"
    },
    blockStatus:{
        type:Boolean,
        default:false
    },

    resetPasswordToken : String,
    resetPasswordExpire : Date

})

userSchema.pre("save",async function(next){

    if(!this.isModified("password")) {next()}
    
    this.password = await bcrypt.hash(this.password,10)

});

// JWT token generation 

userSchema.methods.getJWTToken = function (){
return jwt.sign({id:this._id},process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_EXPIRE
})
}

// compare password

userSchema.methods.comparePassword = async function  (enteredPassword){

    return await bcrypt.compare(enteredPassword,this.password)
}

// generate password reset token

userSchema.methods.getResetPasswordToken = async function (){


    //generating token

    const resetToken = crypto.randomBytes(20).toString("hex")

    // hashing and adding reset password token to userSchema

    this.resetPasswordToken =crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
}


module.exports =mongoose.model("user",userSchema)