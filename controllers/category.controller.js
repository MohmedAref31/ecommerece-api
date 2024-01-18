const { uploadSingleImage } = require("../middlewares/imageUpload.middleware");
const { resizeImage } = require("../middlewares/resizeImage.middleware");
const Category = require("../models/category.model");
const {
  createDocument,
  getDocumentById,
  updateDocumentById,
  deleteDocumentById,
  getAll,
} = require("../utiles/handlers.utiles");


exports.uploadImage = uploadSingleImage("image");
exports.resizeImage = resizeImage("categories", 500, 80);

//@desc create category
//@route POST /api/category
//@access private
exports.createCategory = createDocument(Category);

//@desc get list of categories
//@route GET /api/category
//@access public
exports.getCategories = getAll(Category);

//@desc   get specific Category with id
//@route  GET /api/Category/:id
//@access public
exports.getCategoryWithId = getDocumentById(Category);

//@desc   update Category with id
//@route  PUT /api/Category/:id
//@access private
exports.updateCategory = updateDocumentById(Category);

//@desc   delete Category with id
//@route  DELETE /api/Category/:id
//@access private
exports.deleteCategory = deleteDocumentById(Category);
