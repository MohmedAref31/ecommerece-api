const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      minLength: [3, "Too short product title"],
      maxLength: [100, "Too long product title"],
      trim: true,
    },
    slug: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      minLength: [20, "Too short product description"],
      tirm: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    ratingsAverage: {
      type: Number,
      min: [1, "Rating must be between 1 an 5"],
      max: [5, "Rating must be between 1 an 5"],
    },
    colors: [String],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Product must belong to category"],
      ref: "Category",
    },
    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subcategory",
      },
    ],
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    imageCover: {
      type: String,
      required: [true, "Product cover image must be provided"],
      trim: true,
    },
    images: [String],
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});

productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

productSchema.pre(/^findOne/, function (next) {

  this.populate("reviews");
  next();
});

const addHostPrefixToImagePath = function (doc) {
  if (doc.imageCover)
    doc.imageCover = `${process.env.HOST_NAME}${doc.imageCover}`;
  if (doc.images)
    doc.images = doc.images.map((image) => `${process.env.HOST_NAME}${image}`);
};
productSchema.post("init", (doc) => {
  addHostPrefixToImagePath(doc);
});

productSchema.post("save", (doc) => {
  addHostPrefixToImagePath(doc);
});
const Category = mongoose.model("Product", productSchema);

module.exports = Category;
