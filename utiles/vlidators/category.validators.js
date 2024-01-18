const { check } = require("express-validator");

const {
  validatorMiddleware,
} = require("../../middlewares/validator.middleware");

exports.getCategoryValidate = [
  check("id").isMongoId().withMessage("Invalid mongoId"),
  validatorMiddleware,
];

exports.deleteCategoryValidate = [
  check("id").isMongoId().withMessage("Invalid mongoId"),
  validatorMiddleware,
];

exports.createCategoryValidate = [
  check("name")
    .isString()
    .withMessage("Category name must be string")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 30 })
    .withMessage("Too long category name"),
];

exports.updateCategoryValidate = [
  check("id").isMongoId().withMessage("Invalid mongoId"),
  check("name")
    .isString()
    .withMessage("Category name must be string")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Too short category name")
    .isLength({ max: 30 })
    .withMessage("Too long category name"),
];
