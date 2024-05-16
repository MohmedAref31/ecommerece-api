
const router = require("express").Router();

const { signup ,login, forgetPassword,resetPassword, verifyResetCode, googleAuth} = require("../controllers/auth.controller");
const { signupValidate, loginValidate } = require("../utiles/vlidators/auth.validators");
 


router.post("/signup",signupValidate,signup)
router.post("/login",loginValidate,login)
router.post('/google', googleAuth)
router.post("/forgetPassword",forgetPassword)
router.post("/verifyResetCode",verifyResetCode)
router.put("/resetPassword",resetPassword)






module.exports = router;
