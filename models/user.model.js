const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const addressSchema = new mongoose.Schema({
  alias: String,
  details: {
    type: String,
    required: [true, "address details required"],
  },
  phone: String,
  city: String,
  postalCode: String,
});

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: [true, "username is required"],
      unique: true,
      trim: true,
      minLength: [6, "too short username length"],
      maxLength: [20, "too long username length"],
    },

    profileImage: {
      type: String,
    },
    password: {
      type: String,
      require: [true, "password is required"],
      trim: true,
      minLength: [6, "too short password length"],
    },
    email: {
      type: String,
      require: [true, "email is required"],
      unique: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      trim: true,
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    method:{
      type:String,
      default:'register'
    },
    resetCode: String,
    resetCodeTime: Date,
    resetCodeUsed: Boolean,
    wishlist: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses:[addressSchema]
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});
const addHostPrefixToImagePath = function (doc) {
  if (doc.image) doc.image = `${process.env.HOST_NAME}${doc.image}`;
};
userSchema.post("init", (doc) => {
  addHostPrefixToImagePath(doc);
});

userSchema.post("save", (doc) => {
  addHostPrefixToImagePath(doc);
});

const User = mongoose.model("User", userSchema);

module.exports = User;
