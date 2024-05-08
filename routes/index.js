const router = require("express").Router();

const ErrorClass = require("../utiles/ErrorClass.utiles");
const categoryRoutes = require("./category.route");
const subcategoryRoutes = require("./subcategory.route");
const brandRoutes = require("./brand.route");
const productRoutes = require("./product.route");
const userRoutes = require("./user.route");
const wishlistRoutes = require("./wishlist.route");
const addressRoutes = require("./address.route");
const authRoutes = require("./auth.route");
const reviewRoutes = require("./review.route");
const couponRoutes = require("./coupon.route");
const cartRoutes = require("./cart.route");
const orderRoutes = require("./order.route");
const { uploadSingleImage, handleCloudUpload } = require("../middlewares/imageUpload.middleware");

router.use("/auth", authRoutes);
router.use("/product", productRoutes);

router.use("/user", userRoutes);
router.use("/wishlist", wishlistRoutes);
router.use("/address", addressRoutes);

router.use("/category", categoryRoutes);
router.use("/subcategory", subcategoryRoutes);
router.use("/brand", brandRoutes);
router.use("/review", reviewRoutes);
router.use("/coupon", couponRoutes);
router.use("/cart", cartRoutes);
router.use("/order", orderRoutes);

// router.post('/webhooks/checkoutComplete',express.raw({}), checkoutComplete)

router.post('/upload', uploadSingleImage("image"), async(req, res)=>{
  console.log(req.file)
  try {
    if(req.file){
       const b64 = Buffer.from(req.file.buffer).toString("base64");
    // console.log(b64)
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const cldRes = await handleCloudUpload(dataURI);
    console.log(cldRes) 
    }
   
  } catch (error) {
    console.log(error)
  }
})

router.all("*", (req, res, next) => {
  next(
    new ErrorClass(`sorry there is no such a route ${req.originalUrl}`, 404)
  );
});
module.exports = router;
