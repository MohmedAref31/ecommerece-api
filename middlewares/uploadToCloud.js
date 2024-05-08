const asyncHandler = require("express-async-handler");
const { handleCloudUpload } = require("./imageUpload.middleware");

exports.uploadToCloud = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const b64 = Buffer.from(req.file.buffer).toString("base64");

    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const cldRes = await handleCloudUpload(dataURI);
    
    req.body.image = cldRes.url;
    console.log(cldRes)
  }
  next()
});

// exports.imageField = ()