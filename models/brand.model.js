const mongoose = require("mongoose")


const brandSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"category name is a must"],
        unique:[true,'category name must be unique'],
        minlength:[3, 'min length is 3 characters'],
        maxlength:[30, 'max length is 30 characters'],
    },
    slug:{
        type:String,
        lowercase:true
    },
    image:String,
},{
    timestamps:true
})
const addHostPrefixToImagePath = function(doc){
    if(doc.image)
    doc.image = `${process.env.HOST_NAME}${doc.image}`
}
brandSchema.post('init', (doc) => {
    addHostPrefixToImagePath(doc)
  });

  brandSchema.post('save', (doc) => {
    addHostPrefixToImagePath(doc)
  });

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand