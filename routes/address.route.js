const router = require("express").Router();
const {addAddress, deleteAddress, getLoggedUserAddresses, updateAddress} = require("../controllers/address.controller");
const { authentication, allowedTo } = require("../middlewares/auth.middleware");
const { addAddressValidate, updateAddressValidate } = require("../utiles/vlidators/address.validators");

router.use(authentication,allowedTo("user"))
router.route("/").post(addAddressValidate,addAddress).get(getLoggedUserAddresses)

router.route("/:addressId").delete(deleteAddress).put(updateAddressValidate,updateAddress)




module.exports = router