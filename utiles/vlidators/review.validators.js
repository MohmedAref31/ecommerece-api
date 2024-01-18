const { check } = require("express-validator");

const {
  validatorMiddleware,
} = require("../../middlewares/validator.middleware");
const Review = require("../../models/review.model");
const ErrorClass = require("../ErrorClass.utiles");

exports.createReviewValidate = [
  check("title").optional().isString(),
  check("rate")
    .isFloat({ min: 1, max: 5 })
    .withMessage("rate must be between 1 and 5"),
  check("product").isMongoId().withMessage("Invalid Id"),
  check("user")
    .isMongoId()
    .withMessage("Invalid Id")
    .custom(async (id, { req }) => {
      const review = await Review.findOne({
        user: id,
        product: req.body.product,
      });
      if (review)
        throw new Error(new ErrorClass("you have already rate this product"));
      return true;
    }),

  validatorMiddleware,
];

exports.updateReviewValidate = [
    check("title").optional().isString(),
    check("rate")
        .optional()
      .isFloat({ min: 1, max: 5 })
      .withMessage("rate must be between 1 and 5"),
    check("id").isMongoId().withMessage("Invalid review id")
        .custom(async (revId, {req})=>{
            const review = await Review.findOne({_id: revId});

            if(!review) 
            throw new Error(new ErrorClass("there is no review for this id"))

            if(review.user._id.toString() !== req.user._id.toString())
             throw new Error(new ErrorClass("you are not allowed to acess this route"));

             return true
        }),
  
    validatorMiddleware,
  ];

  exports.deleteReviewValidate = [
    check("id").isMongoId().withMessage("Invalid review id")
    .custom(async (revId, {req})=>{
        const review = await Review.findOne({_id: revId});

        if(!review) 
        throw new Error(new ErrorClass("there is no review for this id"))

        if(req.user.role === "user"){
             if(review.user._id.toString() !== req.user._id.toString())
         throw new Error(new ErrorClass("you are not allowed to acess this route"));

        }
       
         return true
    }),

validatorMiddleware,
  ]

  exports.getReviewValidate = [
      check("id").isMongoId().withMessage("Invalid review id"),
      validatorMiddleware
  ]