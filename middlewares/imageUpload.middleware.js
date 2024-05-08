const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const ErrorClass = require("../utiles/ErrorClass.utiles");


const setUpMulter  =()=>{
    const multerStorage = multer.memoryStorage();

  const filter = (req, file, cb) => {
    const isImage = file.mimetype.split("/")[0];
    if (isImage === "image") {
      cb(null, true);
    } else {
      cb(new ErrorClass("Onley Images Are Allowed", 400), false);
    }
  };

  const upload = multer({ Storage: multerStorage, fileFilter: filter });
  return upload
} 

exports.uploadSingleImage = (fieldName = "image") => {

  const upload = setUpMulter()
  return upload.single(fieldName);
};


exports.uploadManyImages = (firstField, secondField)=>{
  const upload = setUpMulter()
  return upload.fields([{name:firstField,maxCount:1},{name:secondField, maxCount:6}])
}

cloudinary.config({
  cloud_name:process.env.CLOUD_NAME,
  api_key:process.env.CLOUD_KEY,
  api_secret:process.env.CLOUD_SECRET
})

exports.handleCloudUpload = async(file)=>{
  const res = await cloudinary.uploader.upload(file,{
    resource_type:'image',
  })

  return res
}