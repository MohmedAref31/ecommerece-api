const crypto = require("crypto");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const ErrorClass = require("../utiles/ErrorClass.utiles");
const { sendEmail } = require("../utiles/sendEmail.utiles");

const { generateToken } = require("../utiles/generateToken.utiles");

const hash = (text) => crypto.createHash("sha256").update(text).digest("hex");

exports.signup = asyncHandler(async (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    phone: req.body.phone,
  });

  await user.save();

  const token = generateToken({ id: user._id });

  res.send({ data: user, token });
});

exports.login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user)
    throw new Error(new ErrorClass("Email or Password is not valid", "404"));

  const isMatch = await bcrypt.compare(req.body.password, user.password);

  if (!isMatch)
    throw new Error(new ErrorClass("Email or Password is not valid", "404"));

  const token = generateToken({ id: user._id });

  res.send({ data: user, token });
});

exports.googleAuth = asyncHandler(async (req, res, next) => {
  const { email, username, profileImage } = req.body;

  let user = await User.findOne({ email });

  if (user) {
    const token = generateToken({ id: user._id });
    res.json({ data: user, token });
  } else {
    const password = (Math.random() * 10000).toString(32).slice(-8);
    console.log(password)
    user = new User({
      username,
      password,
      email,
      profileImage,
    });

    await user.save();

    const token = generateToken({ id: user._id });

    res.json({ data: user, token });
  }
});

exports.forgetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) next(new ErrorClass("this email is not exist"));

  const resetCode = (Math.floor(Math.random() * 900000) + 100000).toString();

  const resetCodeHashed = hash(resetCode);
  console.log(resetCode);
  console.log(resetCodeHashed);

  user.resetCode = resetCodeHashed;
  user.resetCodeTime = Date.now() + 5 * 60 * 1000;
  user.resetCodeUsed = false;

  const options = {
    reciever: req.body.email,
    subject: "reset password code (valid for 5 minuts)",
    html: `
    <h1>Hi ${user.username}</h1>
    <p style="color:red"> Here is your reset code</p>
    <p style="font-size:25px;text-align:center">${resetCode}</p>`,
  };

  await sendEmail(options)
    .then(async () => {
      res.send(`a code was sent to you email <${req.body.email}>`);
    })
    .catch((e) => {
      user.resetCode = undefined;
      user.resetCodeTime = undefined;
      user.resetCodeUsed = undefined;

      next(new ErrorClass(e.message, 500));
    });

  await user.save().catch((e) => console.log(e));
});

exports.verifyResetCode = asyncHandler(async (req, res, next) => {
  const resetCodeHashed = hash(req.body.resetCode);
  console.log(req.body.resetCode);
  console.log(resetCodeHashed);

  const user = await User.findOne({
    resetCode: resetCodeHashed,
    resetCodeTime: { $gt: Date.now() },
  });

  console.log(user);

  if (!user) return next(new ErrorClass("the code is invalid or expired", 400));

  user.resetCodeUsed = true;

  await user.save();

  res.send({ message: "SUCCESS" });
});

exports.resetPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new ErrorClass("User not found", 404));

  if (!user.resetCodeUsed)
    return next(new ErrorClass("you must verify your reset code", 400));

  user.password = req.body.newPassword;

  user.resetCode = undefined;
  user.resetCodeTime = undefined;
  user.resetCodeUsed = undefined;

  await user.save();

  const token = generateToken({ id: user._id });

  res.json({ token: token });
});
