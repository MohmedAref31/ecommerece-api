const mongoose = require("mongoose");
const Product = require("./product.model");

const reviewSchema = new mongoose.Schema(
  {
    title: String,
    rate: {
      type: Number,
      require: [true, "review rate is required"],
      min: [1, "review rate must be between 1 and 5"],
      max: [5, "review rate must be between 1 and 5"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

reviewSchema.pre(/^find/, function (next) {
  this.populate({ path: "user", select: "username" });
  next();
});

reviewSchema.statics.calcAverageRating = async function (productId) {
  const result = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: "$product",
        ratingsAverage: { $avg: "$rate" },
        ratingsQuantity: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    const { ratingsAverage, ratingsQuantity } = result[0];
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage,
      ratingsQuantity,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      ratingsAverage: 0,
      ratingsQuantity: 0,
    });
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calcAverageRating(this.product);
});

reviewSchema.post("findOneAndDelete", async (doc) => {
    console.log(doc)
  await doc.constructor.calcAverageRating(doc.product);
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
