const router = require("express").Router();


const {
  createCategory,
  getCategories,
  getCategoryWithId,
  updateCategory,
  deleteCategory,
  uploadImage,
  resizeImage,
} = require("../controllers/category.controller");
const {
  createCategoryValidate,
  getCategoryValidate,
  updateCategoryValidate,
  deleteCategoryValidate,
} = require("../utiles/vlidators/category.validators");

const subcategoryRoutes = require("./subcategory.route");

const {authentication, allowedTo} = require("../middlewares/auth.middleware")


router
  .route("/")
  .post(authentication,allowedTo("admin"),createCategoryValidate,uploadImage,resizeImage, createCategory)
  .get(getCategories);
router
  .route("/:id")
  .get(getCategoryValidate, getCategoryWithId)
  .put(authentication,allowedTo("admin"),updateCategoryValidate,uploadImage,resizeImage, updateCategory)
  .delete(authentication,allowedTo("admin"),deleteCategoryValidate, deleteCategory);

router.use('/:categoryId/subcategory',subcategoryRoutes )
module.exports = router;
