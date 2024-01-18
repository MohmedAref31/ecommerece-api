const router = require("express").Router();


const {
  createReview,
  getReviews,
  getReviewWithId,
  updateReview,
  deleteReview,

} = require("../controllers/review.controller");
const {
  createReviewValidate,
  getReviewValidate,
  updateReviewValidate,
  deleteReviewValidate,
} = require("../utiles/vlidators/review.validators");



const {authentication, allowedTo} = require("../middlewares/auth.middleware");


router.route("/").post(authentication,allowedTo("user"),createReviewValidate,createReview).get(getReviews)

router.route("/:id").put(authentication,allowedTo("user"),updateReviewValidate,updateReview).get(getReviewValidate,getReviewWithId).delete(authentication,allowedTo("user","admin"),deleteReviewValidate,deleteReview)


module.exports = router;
