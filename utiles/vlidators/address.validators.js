const { check } = require("express-validator");
const {
  validatorMiddleware,
} = require("../../middlewares/validator.middleware");
const ErrorClass = require("../ErrorClass.utiles");


exports.addAddressValidate = [
    check("alias")
    .notEmpty().withMessage("Please enter alias name")
    .custom(async(alias,{req})=>{
        const {addresses} = req.user;
        console.log(addresses);
       const isExist = addresses.find((address)=>address.alias === alias)
       if(isExist)
       throw new Error(new ErrorClass("this alias name is already exists"));

       return true
    }),
    check("details").notEmpty().withMessage("Please enter an address details").isString(),
    check("phone").optional().isMobilePhone("ar-EG"),
    check("postalCode").optional().isPostalCode("any"),
    validatorMiddleware
]

exports.updateAddressValidate = [
    check("addressId").isMongoId().withMessage("invalid address id"),
    check("alias")
    .optional()
    .custom(async(alias,{req})=>{
        const {addresses} = req.user;
        console.log(addresses);
       const isExist = addresses.find((address)=>address.alias === alias)
       if(isExist)
       throw new Error(new ErrorClass("this alias name is already exists"));

       return true
    }),
    check("details").optional().isString(),
    check("phone").optional().isMobilePhone("ar-EG"),
    check("postalCode").optional().isPostalCode("any"),
    validatorMiddleware
]