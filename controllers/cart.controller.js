const asyncHandler = require("express-async-handler");

const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Coupon = require("../models/coupon.model");
const ClassError = require("../utiles/ErrorClass.utiles");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price;
  });
  
  return totalPrice;
};

exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId);
  // get logged user cart
  const cart = await Cart.findOne({ user: req.user._id });

  // check if user has cart
  if (!cart) {
    await Cart.create({
      user: req.user._id,
      cartItems: [{ product: productId, color, price: product.price }],
    });
  } else {
    // check if product is already in cart and the color is the same
    const ItemIndex = cart.cartItems.findIndex(
      (item) => item.product.toString() === productId && item.color === color
    );

    console.log(ItemIndex);
    if (ItemIndex > -1) {
      // increase item quantity by 1 if
      cart.cartItems[ItemIndex].quantity += 1;
      cart.cartItems[ItemIndex].price =
        cart.cartItems[ItemIndex].quantity * product.price;
    } else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  cart.totalCartPrice = calcTotalPrice(cart);

  await cart.save();

  res.send(cart);
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id }).populate(
    "cartItems.product",
    "title imageCover -category"
  );
  if (!cart) next(new ClassError("there is no cart you", 404));
  res.status(200).json({ status: "SUCCESS", data: cart });
});

exports.deleteCartItem = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true, runValidators: true }
  );
  if (!cart) next(new ClassError("there is no cart you", 404));

  cart.totalCartPrice = calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({ status: "SUCCESS", data: cart });
});

exports.updateCartItemQuantity = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) next(new ClassError("there is no cart you", 404));

  const itemIndex = cart.cartItems.findIndex(
    (item) => item._id.toString() === req.params.id
  );
  if (itemIndex > -1) {
    const item = cart.cartItems[itemIndex];
    // get price for one piece of an item ;
    const priceForOnePiece = (item.price / item.quantity).toFixed(2);
    console.log(priceForOnePiece);
    item.quantity = req.body.quantity;
    item.price = (priceForOnePiece * item.quantity).toFixed(2);

    cart.cartItems[itemIndex] = item;
  } else {
    next(new ClassError(`there is no item with this id $req.params.id}`, 404));
  }
  console.log(calcTotalPrice(cart), cart);
  cart.totalCartPrice = calcTotalPrice(cart);
  await cart.save();
  res.status(200).json({ status: "SUCCESS", data: cart });
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({ name: req.body.coupon,expiryDate:{$gt:Date.now()} });
  if(!coupon)
    next(new ClassError(`this coupon "${req.body.coupon}" is expired or invalid!!`,400));

  const cart = await Cart.findById(req.params.id);
next(new ClassError(`there is no cart for this id ${req.params.id}`,400));
  cart.totalCartPriceAfterDiscount =
    cart.totalCartPrice - (cart.totalCartPrice * coupon.discount) / 100;

 cart.save().then(res.json({status:"success",data:cart}))
});
