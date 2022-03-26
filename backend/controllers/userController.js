const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const User = require("../models/userModels");
const sendToken = require("../utils/jwtToken");
const catchAsyncError = require("../middleware/catchAsyncError");
const { generateAndSendOtp, validateOtp } = require("../utils/otpHandlers");
const sendMail = require("../utils/sendMail");
const cloudinary = require("cloudinary")

// Register user

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { fname, lname, phone, gender, email, password } = req.body;

  const user = await User.create({
    fname,
    lname,
    phone,
    gender,
    email,
    password,
    avatar: {
      public_id: "sample image",
      url: "profile pic",
    },
  });

  sendToken(user, 201, res);
});

// login user

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  // checking user has given email and password

  if (!email || !password) {
    return next(new ErrorHandler("Plese enter email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid email or password", 404));
  }

  //   console.log("api call: ",user.blockStatus);
  if (user.blockStatus) return next(new ErrorHandler("Admin Bolcked You", 200));

  sendToken(user, 200, res);
});

// otp generation and send

exports.otpGenerator = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ phone: req.body.number });

  if (!user)
    return next(new ErrorHandler("Invaid Mobile Number register first", 401));

  generateAndSendOtp(user, 200, res);
});
// otp validtion

exports.otpValidator = catchAsyncError(async (req, res, next) => {
  const { phone, code } = req.body;
  const user = await User.findOne({ phone });
  // console.log(user);

  if (!user) return next(new ErrorHandler("Iivalid varification code", 401));

  validateOtp(user,code, 200, res);
});

// user logout

exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out Successfully",
  });
});

//forgot password

exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new ErrorHandler("User not found !", 404));

  // get reset password

  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/password/reset/${resetToken}`;

  const message = `Your Password Reset Token is  :- \n \n ${resetPasswordUrl} \n \n IF you are not requested this email then please ignore it !`;

  try {
    // await sendMail({
    //     email:user.email,
    //     subejct:"Reset Password Recovery",
    //     message
    // });

    res.status(200).json({
      success: true,
      message: `email send to ${user.email} successfully !`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler(error.message, 500));
  }
});

// get user details

exports.getUserDetails = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  if (!user) return next(new ErrorHandler("User not found !", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

// update user password

exports.updateUserPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const isPasswordMatched = await user.comparePassword(req.body.oldPassword);

  if (!isPasswordMatched)
    return next(new ErrorHandler(" Old Password is incorrect !", 400));

  if (req.body.newPassword !== req.body.confirmPassword)
    return next(new ErrorHandler("Password does not match !", 400));

  user.password = req.body.newPassword;

  await user.save();

  sendToken(user, 200, res);
});

// update user profile

exports.updateUserProfile = catchAsyncError(async (req, res, next) => {

  const newUserData = {
    fname:req.body.fname,
    lname:req.body.lname,
    email:req.body.email,
    phone:req.body.phone,
    
  }

  if (req.body.avatar !== "") {
    const user = await User.findById(req.user.id);

    const imageId = user.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
      crop: "scale",
    });

    newUserData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

 



  const user = await User.findByIdAndUpdate(req.user.id,newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });


  res.status(200).json({
    success: true,
    user,
  });
});

// get all users (amdin)

exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  if (!users) return next(new ErrorHandler("Users Not Found !", 404));
  // console.log(users);

  res.status(200).json({
    success: true,
    users,
  });
});

// get single user (admin)

exports.getSingleUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user)
    return next(
      new ErrorHandler(`Users Not Found  with ${req.params.id} !`, 404)
    );

  res.status(200).json({
    success: true,
    user,
  });
});

// update user role (amdin)

exports.updateUserRole = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    fname: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(200).json({
    success: true,
    user,
  });
});

// Delete user (amdin)

exports.DeleteUser = catchAsyncError(async (req, res, next) => {
  // remove coludinary

  const user = await User.findById(req.params.id);

  if (!user)
    return next(
      new ErrorHandler(`User does not exist with ${req.params.id} `, 404)
    );

  await user.remove();

  res.status(200).json({
    success: true,
    message: "User Deleted Successfully !",
  });
});

//block user  (admin)

exports.blockUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new ErrorHandler("User Not Found !", 401));

  User.findByIdAndUpdate(
    req.params.id,
    { $set: { blockStatus: true } },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          success: true,
          docs,
        });
      }
    }
  );
});

//un block user  (admin)

exports.unblockUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) return next(new ErrorHandler("User Not Found !", 401));

  User.findByIdAndUpdate(
    req.params.id,
    { $set: { blockStatus: false } },
    function (err, docs) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json({
          success: true,
          docs,
        });
      }
    }
  );
});
