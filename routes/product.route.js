const router = require("express").Router();

const {
  createProduct,
  getProducts,
  updateProduct,
  getProductWithId,
  deleteProduct,
  uploadImages,
  resizeImages,
} = require("../controllers/product.controller");


const {
  createProductValidate,
  updateProductValidate,
  getProductValidate,
  deleteProductValidate,
} = require("../utiles/vlidators/product.validators");

const { authentication,allowedTo } = require("../middlewares/auth.middleware");


router.get("/",getProducts) 
router.get("/:id",getProductValidate, getProductWithId)

router.use(authentication)
router.use(allowedTo("admin"))
// ! protected routes
router.route("/").post(uploadImages,resizeImages,createProductValidate, createProduct);

router
  .route("/:id")
  .put(uploadImages,resizeImages,updateProductValidate, updateProduct)
  .delete(allowedTo("admin"),deleteProductValidate, deleteProduct);
module.exports = router;
