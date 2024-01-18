const { uploadManyImages } = require("../middlewares/imageUpload.middleware");
const { resizeProductImages } = require("../middlewares/resizeImage.middleware");
const Product = require("../models/product.model");
const {
  createDocument,
  getDocumentById,
  updateDocumentById,
  deleteDocumentById,
  getAll,
} = require("../utiles/handlers.utiles");



exports.uploadImages = uploadManyImages("imageCover","images");

exports.resizeImages = resizeProductImages("products",400,90,"jpeg")






//@desc create product
//@route POST /api/product
//@access private
exports.createProduct = createDocument(Product);

//@desc get list of products
//@route GET /api/product
//@access public
exports.getProducts = getAll(Product, "product");

//@desc   get specific product with id
//@route  GET /api/product/:id
//@access public
exports.getProductWithId = getDocumentById(Product);

//@desc   update product with id
//@route  PUT /api/product/:id
//@access private
exports.updateProduct = updateDocumentById(Product);

//@desc   delete product with id
//@route  DELETE /api/product/:id
//@access private
exports.deleteProduct = deleteDocumentById(Product);
