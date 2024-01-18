const router = require("express").Router();
const {addToWishlist, deleteFromWishlist, getLoggedUserWishlist} = require("../controllers/wishlist.controller");
const { authentication, allowedTo } = require("../middlewares/auth.middleware");

router.use(authentication,allowedTo("user"))
router.route("/").post(addToWishlist).get(getLoggedUserWishlist)

router.route("/:productId").delete(deleteFromWishlist)




module.exports = router