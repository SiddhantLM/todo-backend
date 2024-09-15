const express = require("express");
const router = express.Router();

const { signup, login, sendotp } = require("../controllers/auth");
const { forgotPassMail, resetPassword } = require("../controllers/forgotPass");
// const { isAuth } = require("../middlewares/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/sendotp", sendotp);   
// router.post("/auth/signup",signup);

router.post("/forgot-pass", forgotPassMail);
router.post("/reset-pass", resetPassword);

module.exports = router;
