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

const { authentication, allowedTo } = require("../middlewares/auth.middleware");
const { uploadToCloud } = require("../middlewares/uploadToCloud");
const { uploadSingleImage } = require("../middlewares/imageUpload.middleware");

router
  .route("/")
  .post(
    authentication,
    allowedTo("admin"),
    uploadSingleImage("image"),
    uploadToCloud,
    createCategoryValidate,
    createCategory
  )
  .get(getCategories);
router
  .route("/:id")
  .get(getCategoryValidate, getCategoryWithId)
  .put(
    authentication,
    allowedTo("admin"),
    uploadSingleImage("image"),
    uploadToCloud,
    updateCategoryValidate,
    updateCategory
  )
  .delete(
    authentication,
    allowedTo("admin"),
    deleteCategoryValidate,
    deleteCategory
  );

router.use("/:categoryId/subcategory", subcategoryRoutes); 
module.exports = router;
