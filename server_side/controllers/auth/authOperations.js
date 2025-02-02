const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../../models/userModel");
const transporter = require("../../mails/nodeMailer");

const userRegister = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }
  try {
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    // generating token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    // sending the data in to cookie

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    // Sending welcome email

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Welcome to Melody",
      text: `Welcome to Melody, ${name} ! Let the music inspire your journey—sign in and start creating your soundtrack to success.`,
    };
    await transporter.sendMail(mailOptions);

    return res.json({ success: true });
  } catch (error) {
    res.json({
      success: false,
      message: ` the error is ${error.message}`,
    });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({
      succes: false,
      message: "missing credintials ",
    });
  }

  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res.json({ success: false, message: "invalid email" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 2 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, message: "You have Login" });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

const Logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({
      success: true,
      message: "Logged out",
    });
  } catch (error) {
    res.josn({
      success: false,
      message: error.message,
    });
  }
};

const sendVerifyOtp = async (req, res) => {
  try {
    const { userId } = req.body;

    // Find user by ID
    const user = await userModel.findById(userId);

    if (user.isAccountVerified) {
      return res.json({ success: false, message: "Account already verified" });
    }

    // Generate OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Set OTP and expiration time
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

    // Save user with the new OTP
    await user.save();

    // Mail options for sending OTP
    const mailOptions = {
      from: "karvinanadakishore@gmail.com",
      to: user.email,
      subject: "Account Verification OTP",  // Corrected typo (OTP should be uppercase)
      text: `Your OTP is ${otp}. Verify your account using this OTP.`,
    };

    // Send OTP email
    await transporter.sendMail(mailOptions);

    // Send success response
    res.json({
      success: true,
      message: "Verification OTP sent to your email.",
    });
    
  } catch (error) {
    // Send error response
    res.json({ success: false, message: error.message });
  }
};

// verfied email wiht opt
const verifyEmail = async (req, res) => {
  const { userId, otp } = req.body;
  if (!userId || !otp) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      return res.josn({ success: false, message: "user not found" });
    }
    if (user.verifyOtp === " " || user.verifyOtp !== otp) {
      return res.josn({ success: false, message: "Invalid OTP" });
    }
    if (user.verifyOtpExpireAt < Date.now()) {
      return res.josn({ success: false, message: "OTP expried" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;

    await user.save();

    return res.json({ success: true, message: "OTP verfied" });
  } catch (error) {
    return res.json({
      success: false,
      message: "Missing Details",
    });
  }
};

// Check if user is authenticated
const isAunthenticated = async (req, res)=>{

  try {

    return res.json({success: true});
    
  } catch (error) {

    res.json({success:false, message: error.message })
    
  }

}

// Send Password Reset OTP
const sendResetOtp = async (req, res)=>{

  const {email} = req.body;
  if (!email){
    return res.json({success:false, message:"Email is required"})
  }

  try {
    const user = await userModel.findOne({email});
    if(!user){
      return res.json({success:false, message:"User not found"});
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    // Set OTP and expiration time
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

    await user.save()

    // Mail options for sending OTP
    const mailOptions = {
      from: "karvinanadakishore@gmail.com",
      to: user.email,
      subject: "Password reset OTP",  // Corrected typo (OTP should be uppercase)
      text: `Your OTP for resetting your password ${otp}.To Verify your account using this OTP.`,
    };

    // Send OTP email
    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message:"OTP sent to your email"
    })

    
  } catch (error) {
    
  }

}

// Reset password
const restPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: 'Email, OTP, and new password are required' });
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: 'User not found' });
    }

    if (!user.resetOtp || user.resetOtp !== otp) {
      return res.json({ success: false, message: 'Invalid OTP' });
    }

    if (user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: 'OTP has expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetOtp = ""; // Clear OTP
    user.resetOtpExpireAt = 0; // Reset OTP expiration time

    await user.save();
    
    res.json({ success: true, message: 'Password has been reset successfully' });
    
  } catch (error) {
    return res.json({ success: false, message: error.message || 'An error occurred' });
  }
};



module.exports = { userRegister, Login, Logout, sendVerifyOtp, verifyEmail, isAunthenticated, sendResetOtp, restPassword};
