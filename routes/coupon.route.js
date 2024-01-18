const router = require("express").Router();


const {
  createCoupon,
  getCoupons,
  getCouponWithId,
  updateCoupon,
  deleteCoupon,

} = require("../controllers/coupon.controller");



const {authentication, allowedTo} = require("../middlewares/auth.middleware")

router.use(authentication,allowedTo("admin"))
router
  .route("/")
  .post( createCoupon)
  .get(getCoupons);
router
  .route("/:id")
  .get(getCouponWithId)
  .put( updateCoupon)
  .delete( deleteCoupon);


module.exports = router;
