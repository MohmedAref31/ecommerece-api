const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const ErrorClass = require("../utiles/ErrorClass.utiles");

exports.addToWishlist = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: req.body.product } },
    { runValidators: true, new: true }
  ).populate("wishlist");

  if (!user) next(new ErrorClass("there is no user for that id", 404));

  res.json({ status: "SUCCESS", data: user.wishlist });
});

exports.getLoggedUserWishlist = asyncHandler(async (req, res, next) => {
  const { wishlist } = await User.findById(req.user._id).populate("wishlist");
  res.json({ status: "SUCCESS", result: wishlist.length, data: wishlist });
});

exports.deleteFromWishlist = asyncHandler(async (req, res, next) => {
  console.log(req.body, req.params);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: req.params.productId } },
    { runValidators: true, new: true }
  );

  if (!user) next(new ErrorClass("there is no user for that id", 404));

  res.json({ status: "SUCCESS", data: user.wishlist });
});
