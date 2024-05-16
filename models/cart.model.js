const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      require: true,
      ref: "User",
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.ObjectId,
          required: true,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: true,
        },
        color: String,
        price: {
          type: Number,
          default: 0,
        },
        totalPrice: {
          type: Number,
          default: 0,
        },
      },
    ],
    totalCartPrice: Number,
    totalCartPriceAfterDiscount: { type: Number, default: undefined },
    coupon: {
      type: mongoose.Schema.ObjectId,
      ref: "Coupon",
    },
  },
  { timestamps: true }
);

cartSchema.pre(/^find/, function (next) {
  this.populate("coupon");
  next();
});

cartSchema.pre("save", async function (next) {
  const cart = await this.populate("coupon");
  if (cart?.coupon) {
    cart.totalCartPriceAfterDiscount = (
      cart.totalCartPrice -
      cart.totalCartPrice * (cart.coupon.discount / 100)
    ).toFixed(2);
  }
  next();
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
