const asyncHandler = require("express-async-handler");
const User = require("../models/user.model");
const ErrorClass = require("../utiles/ErrorClass.utiles");

exports.addAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { addresses: req.body } },
    { runValidators: true, new: true }
  );

  if (!user) next(new ErrorClass("there is no user for that id", 404));

  res.json({ data: user.addresses });
});
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const {addresses} = user 

  const address = addresses.find(
    (a) => a._id.toString() === req.params.addressId
  );

  console.log(address);
  if (!address) next(new ErrorClass("there is no address for that id", 404));

  Object.keys(req.body).forEach(k=>{
    address[k] = req.body[k]
  });

  console.log(address);

  await user.save()

  res.json({data:user.addresses})
});

exports.getLoggedUserAddresses = asyncHandler(async (req, res, next) => {
  const { addresses } = await User.findById(req.user._id);
  res.json({ status: "SUCCESS", result: addresses.length, data: addresses });
});

exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { addresses: { _id: req.params.addressId } } },
    { runValidators: true, new: true }
  );

  if (!user) next(new ErrorClass("there is no user for that id", 404));

  res.json({ status: "SUCCESS", data: user.addresses });
});
