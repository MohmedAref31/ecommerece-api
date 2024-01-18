const { check } = require("express-validator");

const {
  validatorMiddleware,
} = require("../../middlewares/validator.middleware");

exports.getSubcategoryValidate = [
  check("id").isMongoId().withMessage("Invalid mongoId"),
  validatorMiddleware,
];

exports.deleteSubcategoryValidate = [
  check("id").isMongoId().withMessage("Invalid mongoId"),
  validatorMiddleware,
];

exports.createSubcategoryValidate = [
  check("name")
    .isString()
    .withMessage("Subcategory name must be string")
    .notEmpty()
    .withMessage("Subcategory name is required")
    .isLength({ min: 2 })
    .withMessage("Too short Subcategory name")
    .isLength({ max: 30 })
    .withMessage("Too long Subcategory name"),
  check("category")
    .notEmpty()
    .withMessage("Subcategory must belong to category")
    .isMongoId()
    .withMessage("Invalid mongoId"),
  validatorMiddleware,
];

exports.updateSubcategoryValidate = [
  check("id").notEmpty().isMongoId().withMessage("Invalid mongoId"),
  check("name")
    .isString()
    .withMessage("Subcategory name must be string")
    .notEmpty()
    .withMessage("Subcategory name is required")
    .isLength({ min: 3 })
    .withMessage("Too short Subcategory name")
    .isLength({ max: 30 })
    .withMessage("Too long Subcategory name"),
  check("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid mongoId"),
  validatorMiddleware,
];
