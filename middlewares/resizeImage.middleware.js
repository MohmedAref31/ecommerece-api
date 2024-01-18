const sharp = require("sharp");
const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");

exports.resizeImage = (folderName, width, quality, ext = "jpeg") =>
  asyncHandler(async (req, res, next) => {
    if(!req.file) return next();
    const fileName = `${folderName}-${Date.now()}${uuidv4()}.${ext}`;
    const imagePath = `/${folderName}/${fileName}`;
    await sharp(req.file.buffer)
      .resize(width, width)
      .toFormat(ext)
      .jpeg({ quality: quality })
      .toFile(`uploads${imagePath}`);

    req.body.image = imagePath;
    next();
  });

exports.resizeProductImages = (folderName, width, quality, ext = "jpeg") =>
  asyncHandler(async (req, res, next) => {

    const imageCover = req?.files?.imageCover[0];
    const images = req?.files?.images;

    const resizeOneImage = async (data) => {

      const fileName = `${folderName}-${Date.now()}${uuidv4()}.${ext}`;
      const imagePath = `/${folderName}/${fileName}`;

      await sharp(data)
        .resize(width, width)
        .toFormat(ext)
        .jpeg({ quality: quality })
        .toFile(`uploads${imagePath}`);

      return imagePath;
    };


    if (imageCover) {
      const imagePath = await resizeOneImage(imageCover.buffer);
      console.log(imagePath);
      req.body.imageCover = imagePath;
    }

    if (images) {

      req.body.images = [];

      await Promise.all(
        images.map(async (image) => {
          const imagePath = await resizeOneImage(image.buffer);
          req.body.images.push(imagePath);
        })
      );

    }
    next();
  });
