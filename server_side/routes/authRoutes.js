const express = require("express");
const authRoutes = express.Router();

const {
  userRegister,
  Login,
  Logout,
  sendVerifyOtp,
  verifyEmail,
  isAunthenticated,
  sendResetOtp,
  restPassword,
} = require("../controllers/auth/authOperations");
const userAuthMiddleware = require("../middleware/userAuthMiddleware");

authRoutes.post("/register", userRegister);
authRoutes.post("/login", Login);
authRoutes.post("/logout", Logout);
authRoutes.post("/send-verify-otp", userAuthMiddleware, sendVerifyOtp);
authRoutes.post("/verify-account", userAuthMiddleware, verifyEmail);
authRoutes.get("/is-auth", userAuthMiddleware, isAunthenticated);
authRoutes.post("/send-reset-otp", sendResetOtp);
authRoutes.post("/reset-password", restPassword);

module.exports = authRoutes;
