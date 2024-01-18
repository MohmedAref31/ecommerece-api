const router = require("express").Router();


const {
  createBrand,
  getBrands,
  getBrandWithId,
  updateBrand,
  deleteBrand,

} = require("../controllers/brand.controller");
const {
  createBrandValidate,
  getBrandValidate,
  updateBrandValidate,
  deleteBrandValidate,
} = require("../utiles/vlidators/brand.validators");

const {uploadImage}  = require("../controllers/brand.controller");
// const { resizeImage } = require("../middlewares/resizeImage.middleware");
const {resizeImage}  =require("../controllers/brand.controller");

const {authentication, allowedTo} = require("../middlewares/auth.middleware")

router
  .route("/")
  .post(authentication,allowedTo("admin"),uploadImage,resizeImage,createBrandValidate, createBrand)
  .get(getBrands);
router
  .route("/:id")
  .get(getBrandValidate, getBrandWithId)
  .put(authentication,allowedTo("admin"),uploadImage,resizeImage,updateBrandValidate, updateBrand)
  .delete(authentication,allowedTo("admin"),deleteBrandValidate, deleteBrand);

module.exports = router;
