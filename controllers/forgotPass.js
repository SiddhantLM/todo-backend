const User = require("../models/User");
const otp = require("../models/OTP");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
require("dotenv").config();

const forgotPassMail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Please provide email",
      });
    }

    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(401).send({
        success: false,
        message: "user doesn't exist",
      });
    }

    const token = await jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // console.log(token);
    // user.resetPaswwordExpiry = Date.now() + 3600000;
    // user.token = token;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: process.env.MAIL_HOST,
      port: 465,
      secure: true,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    const mailOptions = {
      from: "image-video-upload",
      to: email,
      subject: "Password reset link",
      html: `<h1>Reset your password</h1> <p>set your new password on this lionk</p><p>This is the link : </p><a href=http://localhost:3000/reset-pass/${token}>http://localhost:4000/reset-pass</a>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: ", info.response);
      }
    });

    // const updatedUser = await User.findOneAndUpdate(
    //   { email: email },
    //   { token: token, resetPaswwordExpiry: Date.now() + 3600000 },
    //   { new: true }
    // );

    // console.log(updatedUser);
    // console.log(token);

    return res.status(200).send({
      success: true,
      message: "token sent successfully",
      token,
    });
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "error while sending the token in mail",
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { password, token } = req.body;
    // console.log(password, "    ", token);
    if (!password || !token) {
      return res.status(401).send({
        success: false,
        message: "resertPassword data not recieved",
      });
    }

    try {
      const decoded = await jwt.verify(token, process.env.JWT_SECRET);
      const hashedPassword = await bcrypt.hash(password, 10);


      await User.findOneAndUpdate(
        { email: decoded.email },
        { password: hashedPassword },
        { new: true }
      );

      return res.status(200).send({
        success: true,
        message: "password changed",
      });
    } catch (error) {
      return res.status(401).send({
        success: false,
        message: "invalid token",
      });
    }

    // if (!(user.resetPaswwordExpiry > Date.now())) {
    //   return res.status(401).send({
    //     success: false,
    //     message: "validity expired",
    //   });
    // }
  } catch (error) {
    return res.status(401).send({
      success: false,
      message: "error while resetting password",
    });
  }
};

module.exports = { forgotPassMail, resetPassword };
