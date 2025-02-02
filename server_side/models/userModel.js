const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address."], // Optional email validation
  },
  password: {
    type: String,
    required: true,
  },
  verifyOtp: {
    // Changed to OTP for consistency
    type: String,
    default: "",
  },
  verifyOtpExpireAt: {
    // Consider using Date type instead of Number for timestamp
    type: Number,
    default: 0,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  resetOtp: {
    type: String,
    default: "",
  },
  resetOtpExpireAt: {
   type:Number, default:0
  },
});



const userModel = mongoose.model.user || mongoose.model("UserDataAuth", userSchema);

module.exports = userModel;