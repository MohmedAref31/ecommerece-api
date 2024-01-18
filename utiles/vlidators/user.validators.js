const { check } = require("express-validator");
const bcrypt = require("bcryptjs");
const {
  validatorMiddleware,
} = require("../../middlewares/validator.middleware");
const User = require("../../models/user.model");
const ErrorClass = require("../ErrorClass.utiles");

exports.getUserValidate = [
  check("id").isMongoId().withMessage("Invalid mongoId"),
  validatorMiddleware,
];

exports.deleteUserValidate = [
  check("id").isMongoId().withMessage("Invalid mongoId"),
  validatorMiddleware,
];

exports.createUserValidate = [
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

exports.updateUserValidate = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid mongoId"),
  check("username")
    .optional()
    .isString()
    .withMessage("User name must be string")
    .isLength({ min: 6 })
    .withMessage("Too short User name")
    .isLength({ max: 20 })
    .withMessage("Too long User name"),
  check("email")
    .optional()
    .isEmail()
    .withMessage("Email is not valid")
    .custom(async (email, { req }) => {
      await User.findOne({ email: email }).then((user) => {
        if (user) {
          return Promise.reject(new Error("Email is already taken"));
        }
      });
    }),
  check("phone")
    .optional()
    .isMobilePhone("ar-EG")
    .withMessage("Only accept egyptian phone numbers"),
  check("profileImage").optional(),
  validatorMiddleware,
];
// exports.updateMeValidate = [
//   check("username")
//     .optional()
//     .isString()
//     .withMessage("User name must be string")
//     .isLength({ min: 6 })
//     .withMessage("Too short User name")
//     .isLength({ max: 20 })
//     .withMessage("Too long User name"),
//   check("email")
//     .optional()
//     .isEmail()
//     .withMessage("Email is not valid")
//     .custom(async (email, { req }) => {
//       await User.findOne({ email: email }).then((user) => {
//         if (user) {
//           return Promise.reject(new Error("Email is already taken"));
//         }
//       });
//     }),
//   check("phone")
//     .optional()
//     .isMobilePhone("ar-EG")
//     .withMessage("Only accept egyptian phone numbers"),
//   check("profileImage").optional(),
//   validatorMiddleware,
// ];

exports.updateUserPasswordValidate = [
  check("id")
    .notEmpty()
    .withMessage("id is required")
    .isMongoId()
    .withMessage("Invalid mongoId"),
  check("oldPassword")
    .notEmpty()
    .withMessage("oldPassword is required")
    .custom(async (pass, { req }) => {
      const user = await User.findById(req.params.id);
      if (!user)
        throw new Error(new ErrorClass("there is no user for such an id"));
      const isMatch = await bcrypt.compare(pass, user.password);
      if (!isMatch) {
        return Promise.reject(new ErrorClass("Old password is incorrect"));
      }
      if (pass === user.password) {
        return Promise.reject(
          new ErrorClass("New password cannot be same as old password")
        );
      }

      return true;
    }),
  check("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 6 })
    .withMessage("too short password length")
    .isLength({ max: 20 })
    .withMessage("too long password length")
    .custom((pass, { req }) => {
      if (pass !== req.body.password)
        throw new Error(
          new ErrorClass("password and password comfirmation are not identical")
        );

      return true;
    }),
  check("passwordComfirmation")
    .notEmpty()
    .withMessage("passwordComfirmation is required"),
  validatorMiddleware,
];
