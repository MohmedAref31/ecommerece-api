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
          default:0
        },
        totalPrice: {
            type: Number,
            default:0
          },
      },
    ],
    totalCartPrice: Number,
    totalCartPriceAfterDiscount: { type: Number, default: undefined },
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
