const mongoose = require("mongoose");

const subcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Subcategory name is required"],
    unique: [true, "Subcategory name must be unique"],
    minLength: [2, "Too short subcategory name"],
    maxLength: [30, "Too long subcategory name"],
  },
  slug: {
    type: String,
    required: true,
    lowercase:true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Subcategory must belong to category"],
  },
  image:String,
});


const addHostPrefixToImagePath = function(doc){
  if(doc.image)
  doc.image = `${process.env.HOST_NAME}${doc.image}`
}
subcategorySchema.post('init', (doc) => {
  addHostPrefixToImagePath(doc)
});

subcategorySchema.post('save', (doc) => {
  addHostPrefixToImagePath(doc)
});
const Subcategory = mongoose.model("Subcategory", subcategorySchema);

module.exports = Subcategory;
