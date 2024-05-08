const router = require("express").Router();


const {
  createUser,
  getUsers,
  getUserWithId,
  updateUser,
  deleteUser,
  updateUserPassword,
  getMe,
  updateMe,
  updateMyPassword,

} = require("../controllers/user.controller");
const {
  createUserValidate,
  getUserValidate,
  updateUserValidate,
  deleteUserValidate,
  updateUserPasswordValidate,
} = require("../utiles/vlidators/user.validators");

const {uploadImage, resizeImage}  = require("../controllers/user.controller");
const { authentication, allowedTo } = require("../middlewares/auth.middleware");
const { uploadSingleImage } = require("../middlewares/imageUpload.middleware");
const { uploadToCloud } = require("../middlewares/uploadToCloud");

router.get("/getMe",authentication,getMe,getUserWithId)
router.put("/updateMe",authentication,uploadSingleImage("profileImage"),uploadToCloud,getMe,updateUserValidate, updateMe);
router.put("/updateMyPassword",authentication,getMe,updateUserPasswordValidate,updateMyPassword)

router.use(authentication,allowedTo("admin"))
router.put("/updatePassword/:id",updateUserPasswordValidate,updateUserPassword)
router
  .route("/")
  .post(uploadImage,resizeImage,createUserValidate, createUser)
  .get(getUsers);
router
  .route("/:id")
  .get(getUserValidate, getUserWithId)
  .put(uploadSingleImage("profileImage"),uploadToCloud,updateUserValidate, updateUser)
  .delete(deleteUserValidate, deleteUser);



module.exports = router;
