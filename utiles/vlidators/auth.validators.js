const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../middlewares/validator.middleware");
const User = require("../../models/user.model");
const ErrorClass = require("../ErrorClass.utiles");

 
exports.signupValidate = [
    check("username")
      .notEmpty()
      .withMessage("User name is required")
      .isString()
      .withMessage("User name must be string")
      .isLength({ min: 6 })
      .withMessage("Too short User name")
      .isLength({ max: 20 })
      .withMessage("Too long User name"),
    check("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Email is not valid")
      .custom(async (email, { req }) => {
        await User.findOne({ email: email }).then((user) => {
          if (user) {
            return Promise.reject(new Error("Email is already taken"));
          }
        });
      }),
    check("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 6 })
      .withMessage("too short password length")
      .isLength({ max: 20 })
      .withMessage("too long password length")
      .custom((pass, { req }) => {
        if (pass !== req.body.passwordComfirmation)
          throw new Error(
            new ErrorClass("password and password comfirmation are not identical")
          );
  
        return true;
      }),
    check("passwordComfirmation")
      .notEmpty()
      .withMessage("passwordComfirmation is required"),
    check("phone")
      .optional()
      .isMobilePhone("ar-EG")
      .withMessage("Only accept egyptian phone numbers"),
    check("profileImage").optional(),
    validatorMiddleware,
  ];


  exports.loginValidate = [

    check("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("Email is not valid")
      ,
    check("password")
      .notEmpty()
      .withMessage("password is required")
      .isLength({ min: 6 })
      .withMessage("too short password length")
      .isLength({ max: 20 })
      .withMessage("too long password length")
     ,
    validatorMiddleware,
  ];