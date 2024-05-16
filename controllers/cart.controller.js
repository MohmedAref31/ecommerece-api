const asyncHandler = require("express-async-handler");

const Cart = require("../models/cart.model");
const Product = require("../models/product.model");
const Coupon = require("../models/coupon.model");
const ClassError = require("../utiles/ErrorClass.utiles");

const calcTotalPrice = (cart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    console.log(item);
    totalPrice += item.price * item.quantity;
  });

  // console.log(totalPrice)
  return totalPrice.toFixed(2);
};

exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, color } = req.body;

  const product = await Product.findById(productId);
  // get logged user cart
  let cart = await Cart.findOne({ user: req.user._id });

  // check if user has cart
  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      cartItems: [
        {
          product: productId,
          color,
          price: product.price,
          totalPrice: product.price,
        },
      ],
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
      cart.cartItems[ItemIndex].price = product.price;
      cart.cartItems[ItemIndex].totalPrice = (
        product.price * cart.cartItems[ItemIndex].quantity
      ).toFixed(2);
    } else {
      cart.cartItems.push({ product: productId, color, price: product.price });
    }
  }

  cart.totalCartPrice = calcTotalPrice(cart);
  
  await cart.save();

  res.send(cart);
});

exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id })
    .populate("cartItems.product", "title imageCover -category")
    .populate("coupon");
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
  const cart = await Cart.findOne({ user: req.user._id }).populate("coupon");
  if (!cart) next(new ClassError("there is no cart you", 404));

  const itemIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === req.params.id
  );
  if (itemIndex > -1) {
    const item = cart.cartItems[itemIndex];

    item.quantity = req.body.quantity;
    item.totalPrice = (item.price * item.quantity).toFixed(2);

    cart.cartItems[itemIndex] = item;
  } else {
    next(
      new ClassError(`there is no item with this id ${req.params.id}}`, 404)
    );
  }
  cart.totalCartPrice = calcTotalPrice(cart);


  await cart.save();
  res.status(200).json({ status: "SUCCESS", data: cart });
});

exports.applyCoupon = asyncHandler(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    name: req.body.coupon,
    expiryDate: { $gt: Date.now() },
  });
  if (!coupon)
    next(
      new ClassError(
        `this coupon "${req.body.coupon}" is expired or invalid!!`,
        400
      )
    );

  const cart = await Cart.findById(req.params.cartId);
  if (!cart)
    next(new ClassError(`there is no cart for this id ${req.params.id}`, 400));
  cart.coupon = coupon._id;

  console.log(cart.totalCartPrice, coupon.discount);
  cart.totalCartPriceAfterDiscount = (
    cart.totalCartPrice -
    cart.totalCartPrice * (coupon.discount / 100)
  ).toFixed(2);

  cart
    .save()
    .then(() => res.json({ status: "success", data: cart }))
    .catch((e) => next(e));
});
