const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const OTP = require("../models/OTP");
const User = require("../models/User");
const otpGenerator = require("otp-generator");
require("dotenv").config();
// const SECRET = process.env.JWT_SECRET;

const signup = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(401).send({
        success: false,
        message: "signup data missing",
      });
    }

    const compareOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);

    if (compareOtp.length === 0) {
      return res.status(401).send({
        success: false,
        message: "otp was not sent to this email",
      });
    }

    if (compareOtp[0].otp !== otp.toString()) {
      return res.status(401).send({
        success: false,
        message: "otp is invalid",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await User.create({
      name: name,
      email: email,
      password: hashedPassword,
      profilePic: `https://api.dicebear.com/9.x/initials/svg/seed=${name}`,
    });
    return res.status(200).send({
      success: true,
      response,
      message: "user created succesfully",
    });
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "failed to sign up",
    });
  }
};

const sendotp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(401).send({
        success: false,
        message: "email not recieved",
      });
    }

    const userPresent = await User.findOne({ email });
    if (userPresent) {
      return res.status(401).send({
        success: false,
        message: "user is already present",
      });
    }

    let otp = await otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });
    let result = await OTP.findOne({ otp: otp });

    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const response = await OTP.create({
      email: email,
      otp: otp,
    });

    return res.status(200).json({
      success: true,
      // response,
      message: "otp sent successfully",
    });
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "error while generating otp",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(401).send({
        success: false,
        message: "login data not recieved",
      });
    }

    const user = await User.findOne({ email: email }).populate("Tasks").exec();
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "the user doesn't exist",
      });
    }

    const response = await bcrypt.compare(password, user.password);
    if (response) {
      const token = jwt.sign(
        { email: user.email},
        process.env.JWT_SECRET,
        {
          expiresIn: "24h",
        }
      );
      //   user.token = token;
      user.password = undefined;
      //   user.resetPaswwordExpiry = undefined;
      user._id = undefined;

      res.status(200).json({
        success: true,
        user,
        token,
        message: "logged in successfully",
      });
    } else {
      return res.status(401).send({
        success: false,
        message: "inavlid password",
      });
    }
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "failed to login",
    });
  }
};

module.exports = { signup, sendotp, login };
