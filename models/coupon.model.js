const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true, "coupon name is required"],
    trim:true,
    unique:[true,"this coupon is already registered"],
  },
  expiryDate:{
    type:Date,
    required:[true, "coupon expiration date is required"],
  },
  discount:{
    type:Number,
    required:[true, "discount value is required"],
    min:1,
    max:100,
  }
  
})

const Coupon = mongoose.model("Coupon",couponSchema)
module.exports = Coupon;
