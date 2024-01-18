const { uploadSingleImage } = require("../middlewares/imageUpload.middleware");
const { resizeImage } = require("../middlewares/resizeImage.middleware");
const Subcategory = require("../models/subcategory.model");
const {
  getDocumentById,
  deleteDocumentById,
  updateDocumentById,
  createDocument,
  getAll,
} = require("../utiles/handlers.utiles");

exports.uploadImage = uploadSingleImage("image");
exports.resizeImage = resizeImage("subcategories", 500, 80);


//@desc create subcategory
//@route POST /api/subcategory
//@access private
exports.createSubcategory = createDocument(Subcategory);

//@desc get list of subcategories
//@route GET /api/subcategory
//@access public
exports.getSubcategories = getAll(Subcategory);

//@desc   get specific subcategory with id
//@route  GET /api/subcategory/:id
//@access public

exports.getSubcategoryWithId = getDocumentById(Subcategory);

//@desc   update subcategory with id
//@route  PUT /api/subcategory/:id
//@access private
exports.updateSubcategory = updateDocumentById(Subcategory);

//@desc   delete subcategory with id
//@route  DELETE /api/subcategory/:id
//@access private

exports.deleteSubcategory = deleteDocumentById(Subcategory);
