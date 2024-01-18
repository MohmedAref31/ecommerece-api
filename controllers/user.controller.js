const asyncHandler = require("express-async-handler");

const { uploadSingleImage } = require("../middlewares/imageUpload.middleware");
const { resizeImage } = require("../middlewares/resizeImage.middleware");
const User = require("../models/user.model");
const {
  getDocumentById,
  updateDocumentById,
  deleteDocumentById,
  createDocument,
  getAll,
} = require("../utiles/handlers.utiles");
const ErrorClass = require("../utiles/ErrorClass.utiles");
const { generateToken } = require("../utiles/generateToken.utiles");

exports.uploadImage = uploadSingleImage("profileImage");
exports.resizeImage = resizeImage("users", 200, 90);

//@desc create User
//@route POST /api/user
//@access private
exports.createUser = createDocument(User);

//@desc get list of categories
//@route GET /api/user
//@access public

exports.getUsers = getAll(User);

//@desc   get specific User with id
//@route  GET /api/user/:id
//@access public
exports.getUserWithId = getDocumentById(User);

//@desc   update User with id
//@route  PUT /api/user/:id
//@access private
// exports.updateUser = updateDocumentById(User);

exports.updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { password, ...data } = req.body;
  const user = await User.findByIdAndUpdate(id, data, { new: true });

  res.send(user);
});

//@desc   update User password with id
//@route  PUT /api/user/updatePassword/:id
//@access private
exports.updateUserPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { password, ...data } = req.body;
  const user = await User.findById(id);

  user.password = password;

  await user.save();

  res.send(user);
});

//@desc   delete User with id
//@route  DELETE /api/user/:id
//@access private
exports.deleteUser = deleteDocumentById(User);

//@desc   GET Logged User
//@route  GET /api/user/getMe
//@access private
exports.getMe = asyncHandler(async (req, res, next) => {
  req.params.id = req.user._id;
  next();
});

// //@desc   UPDATE Logged User
// //@route  PUT /api/user/updateMe
// //@access private
exports.updateMe = asyncHandler(async (req, res, next) => {
  const {id} = req.params;

  console.log(id)
  const user = await User.findByIdAndUpdate(
    id,
    {
      username: req.body.username,
      email: req.body.email,
      phone: req.body.phone,
      profileImage: req.body.image,
    },
    { new: true, runValidators: true }
  );

  console.log(user.username)

  if(!user)
    return next(new ErrorClass("there is no user ", 404));


  res.send(user);
});

// //@desc   UPDATE Logged User password
// //@route  PUT /api/user/updateMyPassword
// //@access private
exports.updateMyPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const { password, ...data } = req.body;
  const user = await User.findById(id);

  user.password = password;

  await user.save();

  const token = generateToken({id})
  res.josn({token});
});