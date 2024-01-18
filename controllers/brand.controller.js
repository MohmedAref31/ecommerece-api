const { uploadSingleImage } = require("../middlewares/imageUpload.middleware");
const { resizeImage } = require("../middlewares/resizeImage.middleware");
const Brand = require("../models/brand.model");
const {
  getDocumentById,
  updateDocumentById,
  deleteDocumentById,
  createDocument,
  getAll,
} = require("../utiles/handlers.utiles");

exports.uploadImage = uploadSingleImage("image");
exports.resizeImage = resizeImage("brands", 500, 80);

//@desc create brand
//@route POST /api/brand
//@access private
exports.createBrand = createDocument(Brand);

//@desc get list of categories
//@route GET /api/brand
//@access public

exports.getBrands = getAll(Brand);

//@desc   get specific Brand with id
//@route  GET /api/Brand/:id
//@access public
exports.getBrandWithId = getDocumentById(Brand);

//@desc   update Brand with id
//@route  PUT /api/Brand/:id
//@access private
exports.updateBrand = updateDocumentById(Brand);

//@desc   delete Brand with id
//@route  DELETE /api/Brand/:id
//@access private
exports.deleteBrand = deleteDocumentById(Brand);
