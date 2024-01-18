const { check } = require("express-validator");

const {
  validatorMiddleware,
} = require("../../middlewares/validator.middleware");

exports.getBrandValidate = [
  check("id").isMongoId().withMessage("Invalid mongoId"),
  validatorMiddleware,
];

exports.deleteBrandValidate = [
  check("id").isMongoId().withMessage("Invalid mongoId"),
  validatorMiddleware,
];

exports.createBrandValidate = [
  check("name")
    .isString()
    .withMessage("Brand name must be string")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2 })
    .withMessage("Too short Brand name")
    .isLength({ max: 30 })
    .withMessage("Too long Brand name"),
];

exports.updateBrandValidate = [
  check("id").isMongoId().withMessage("Invalid mongoId"),
  check("name")
    .isString()
    .withMessage("Brand name must be string")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 2 })
    .withMessage("Too short Brand name")
    .isLength({ max: 30 })
    .withMessage("Too long Brand name"),
];
