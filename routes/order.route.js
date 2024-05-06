const router = require("express").Router();

const {
  createCashOrder,
  getAllOrders,
  getOrderById,
  setFilterObj,
  updateOrderToPaid,
  updateOrderToDelivered,
  createCheckoutSession,
} = require("../controllers/order.controller");
const { authentication, allowedTo } = require("../middlewares/auth.middleware");

router.use(authentication);
router.route("/:cartId").post(allowedTo("user"), createCashOrder);
router.route("/create-session/:cartId").post(allowedTo("user"), createCheckoutSession);
router.route("/").get(allowedTo("user", "admin"),setFilterObj, getAllOrders);
router.route("/:id").get(allowedTo("user", "admin"), getOrderById);
router.route('/:id/paid').put(allowedTo("admin"), updateOrderToPaid)
router.route('/:id/delivered').put(allowedTo("admin"), updateOrderToDelivered)
module.exports = router; 
