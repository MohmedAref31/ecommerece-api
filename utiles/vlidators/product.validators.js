const { check } = require("express-validator");

const {
  validatorMiddleware,
} = require("../../middlewares/validator.middleware");
const Category = require("../../models/category.model");
const Subcategory = require("../../models/subcategory.model");

exports.createProductValidate = [
  check("title")
    .isString()
    .withMessage("title must be string")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Too short title length")
    .isLength({ max: 100 })
    .withMessage("Too long title length"),
  check("description")
    .isString()
    .withMessage("description must be string")
    .notEmpty()
    .withMessage("description is required")
    .isLength({ min: 20 })
    .withMessage("Too short description length")
    .isLength({ max: 500 })
    .withMessage("Too long description length"),
  check("price")
    .notEmpty()
    .withMessage("Product price is required")
    .isNumeric()
    .withMessage("not numric")
    .toFloat()
    .custom((price) => {
      if (price <= 0) {
        throw new Error("price must be more than 0");
      }
      return true;
    }),
  check("priceAfterDiscount")
    .optional()
    .isNumeric()
    .withMessage("priceDiscount must be a number")
    .toFloat()
    .custom((dPrice, { req }) => {
      // console.log(dPrice, req.body.price);
      if (req.body.price <= dPrice) {
        throw new Error("Discount price must be lower than original price");
      }
      return true;
    }),
  check("category")
    .notEmpty()
    .withMessage("Product must belogn to cateagory")
    .isMongoId()
    .withMessage("Invalid mongoId format")
    .custom((categoryId) => {
      Category.findById(categoryId).then((category) => {
        if (!category)
          throw new Error(`there is no category for this ID: ${categoryId}`);
      });
      return true;
    }),
  check("subCategories")
    .optional()
    .isArray()
    .withMessage("Subcategories must be an array of IDs")
    .custom(async (val, { req }) => {
      const { category } = req.body;
      // console.log(req.body);
      const subcategories = await Subcategory.find({ category });
      if (subcategories.length === 0)
        throw Error("this category does not have subcategories");

      const subCategoriesIds = [];
      subcategories.forEach((e) => subCategoriesIds.push(e._id.toString()));

      const checker = val.every((v) => subCategoriesIds.includes(v));
      if (!checker) {
        throw new Error(
          "one or all subcategories don't belong to the category"
        );
      }
      req.body.subcategories = Array.from(new Set(val));
      return true;
    }),
  check("ratingsAverage")
    .optional()
    .isNumeric()
    .isLength({ min: 1, max: 5 })
    .withMessage("Rate must be a number between 1 and 5"),
  check("ratingsQuantity").optional().isNumeric(),
  check("colors")
    .optional()
    .isArray()
    .withMessage("colors must be an array of available colors"),
  check("images")
    .optional()
    .isArray()
    .withMessage("images must be an array of available images"),
  check("image")
    .notEmpty()
    .withMessage("cover image must be provided")
    .isString(),
  check("brand").optional().isMongoId().withMessage("Invalid mongoId format"),
  validatorMiddleware,
];

exports.updateProductValidate = [
  check("id").isMongoId().withMessage("Invalid mongoId"),
  validatorMiddleware,
];

exports.getProductValidate = [
  check("id").isMongoId().withMessage("Invalid mongoId"),
  validatorMiddleware,
];

exports.deleteProductValidate = [
  check("id").isMongoId().withMessage("Invalid mongoId"),
  validatorMiddleware,
];
