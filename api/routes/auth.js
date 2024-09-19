const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const user = require("../model/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const otpStore = {};
const transporter = nodemailer.createTransport({
  service: "gmail", // You can use any other email service like SMTP
  auth: {
    user: "nishant7654531965@gmail.com", // Use your email
    pass: "tlbi evao dcye ntoh", // Use your email password or app-specific password
  },
});
const generateOTP = () => Math.floor(100000 + Math.random() * 900000);
router.post("/register", async (req, res) => {
  const { name, email, password, address } = req.body;
  try {
    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already exists" });
    }
    const otp = generateOTP();
    otpStore[email] = otp;
    const mailOptions = {
      from: "nishant7654531965@gmail.com",
      to: email,
      subject: "Verify your email",
      text: `Your OTP for email verification is: ${otp}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to send OTP" });
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .json({
            message:
              "OTP sent to your email. Please verify to complete registration.",
              name,email,password,address
          });
      }
    });
  } catch (error) {
    console.log("error during registeration");
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/verify-otp", async (req, res) => {
  const { name, email, password, address, otp } = req.body;

  try {
    // Check if OTP matches
    if (otpStore[email] && otpStore[email] === parseInt(otp)) {
      // OTP is correct, proceed to register the user
      delete otpStore[email]; // Clear the OTP after verification

      const salt = await bcrypt.genSalt(10);
      const hashpassword = await bcrypt.hash(password, salt);

      const newUser = new user({
        name,
        email,
        password: hashpassword,
        address,
      });

      const savedUser = await newUser.save();
      res.status(200).json(savedUser);
      console.log(savedUser);
    } else {
      return res.status(400).json({ message: "Invalid OTP or OTP expired" });
    }
  } catch (error) {
    console.log("Error during OTP verification:", error);
    res.status(500).json({ message: "Server error" });
  }
});
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const checkuser = await user.findOne({ email });
    if (!checkuser) {
      return res.status(400).json({ message: "user not found" });
    }
    const isMatch = await bcrypt.compare(password, checkuser.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign({ id: checkuser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Send response with token
    res.status(200).json({
      token,
      checkuser: {
        id: checkuser._id,
        name: checkuser.name,
        email: checkuser.email,
        address: checkuser.address,
      },
    });
    console.log("User logged in:", checkuser);
  } catch (error) {
    console.log("error during registeration");
    res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
