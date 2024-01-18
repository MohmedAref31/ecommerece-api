const router = require("express").Router();

const {
  addToCart,
  getLoggedUserCart,
  deleteCartItem,
  updateCartItemQuantity,
} = require("../controllers/cart.controller");
const { allowedTo, authentication } = require("../middlewares/auth.middleware");

router.use(authentication, allowedTo("user"));
router.route("/").post(addToCart).get(getLoggedUserCart);
router.route("/:id").delete(deleteCartItem).put(updateCartItemQuantity);

module.exports = router;
