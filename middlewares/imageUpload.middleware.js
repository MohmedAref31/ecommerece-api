const multer = require("multer");
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