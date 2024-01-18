const router = require("express").Router({ mergeParams: true });

const {
  getSubcategories,
  createSubcategory,
  updateSubcategory,
  getSubcategoryWithId,
  deleteSubcategory,
  uploadImage,
  resizeImage,
} = require("../controllers/subcategory.controller");
const {
  createSubcategoryValidate,
  updateSubcategoryValidate,
  getSubcategoryValidate,
  deleteSubcategoryValidate,
} = require("../utiles/vlidators/subcategory.validators");

const { authentication, allowedTo } = require("../middlewares/auth.middleware");

router
  .route("/")
  .post(
    authentication,
    allowedTo("admin"),
    createSubcategoryValidate,
    uploadImage,
    resizeImage,
    createSubcategory
  )
  .get(getSubcategories);

router
  .route("/:id")
  .get(getSubcategoryValidate, getSubcategoryWithId)
  .put(
    authentication,
    allowedTo("admin"),
    updateSubcategoryValidate,
    uploadImage,
    resizeImage,
    updateSubcategory
  )
  .delete(
    authentication,
    allowedTo("admin"),
    deleteSubcategoryValidate,
    deleteSubcategory
  );

module.exports = router;
