const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const ErrorClass = require("../utiles/ErrorClass.utiles");
const User = require("../models/user.model");

const authentication = asyncHandler(async (req, res, next) => {
  const token = req.headers?.authorization?.split("Bearer ")[1];

  if (!token) return next(new ErrorClass("not authenticated !", 401));

  const verify = jwt.verify(token, process.env.JWT_SECRET);

  if (!verify) return next(new ErrorClass("not authenticated !", 401));

  const user = await User.findOne({ _id: verify.id });

  if (!user) return next(new ErrorClass("sorry we can't find any user!", 404));

  req.user = user;

  next();
});

const allowedTo = (...roles) =>
  asyncHandler((req, res, next) => {
    if(!roles.includes(req.user.role))
        throw new ErrorClass("you are not allowed to reach this route!", 403)

  next()
  });



module.exports = {
  authentication,
  allowedTo
};
