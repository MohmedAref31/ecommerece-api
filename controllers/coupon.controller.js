
const {
  getDocumentById,
  deleteDocumentById,
  updateDocumentById,
  createDocument,
  getAll,
} = require("../utiles/handlers.utiles");

const Coupon = require("../models/coupon.model")


//@desc create Coupon
//@route POST /api/Coupon
//@access private admin
exports.createCoupon = createDocument(Coupon);

//@desc get list of Coupons
//@route GET /api/Coupon
//@access private admin
exports.getCoupons = getAll(Coupon);

//@desc   get specific Coupon with id
//@route  GET /api/Coupon/:id
//@access private admin

exports.getCouponWithId = getDocumentById(Coupon);

//@desc   update Coupon with id
//@route  PUT /api/Coupon/:id
//@access private admin
exports.updateCoupon = updateDocumentById(Coupon);

//@desc   delete Coupon with id
//@route  DELETE /api/Coupon/:id
//@access private admin

exports.deleteCoupon = deleteDocumentById(Coupon);
