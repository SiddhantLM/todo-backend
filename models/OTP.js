const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
require("dotenv").config();

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5,
  },
});

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

otpSchema.pre("save", function (next) {
  const mailOptions = {
    from: "image-video-upload",
    to: this.email,
    subject: "File uploaded",
    html: `<h1>Your OTP is : ${this.otp}</a>`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email: ", error);
    } else {
      console.log("Email sent: ", info.response);
    }
  });
  next();
});

const OTP = mongoose.model("OTP", otpSchema);
module.exports = OTP;
