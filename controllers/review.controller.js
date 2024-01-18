
const Review = require("../models/review.model");
const {
  getDocumentById,
  updateDocumentById,
  deleteDocumentById,
  createDocument,
  getAll,
} = require("../utiles/handlers.utiles");



//@desc create Review
//@route POST /api/Review
//@access private
exports.createReview = createDocument(Review);

//@desc get list of reviews
//@route GET /api/Review
//@access public

exports.getReviews = getAll(Review);

//@desc   get specific Review with id
//@route  GET /api/Review/:id
//@access public
exports.getReviewWithId = getDocumentById(Review);

//@desc   update Review with id
//@route  PUT /api/Review/:id
//@access private
exports.updateReview = updateDocumentById(Review);

//@desc   delete Review with id
//@route  DELETE /api/Review/:id
//@access private
exports.deleteReview = deleteDocumentById(Review);
