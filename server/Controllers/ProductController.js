const path = require("path");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const Product = require("../Model/ProductSchema");
const { Console, log } = require("console");

// NEED TO WORK ON MAKING IT SO THAT USERS CAN PUT 1 OR MORE PRODUCT IMAGES IN THE IMAGE ARRAY INPUT.

const createProduct = async (req, res) => {
  const {
    body: { name, price, description },
    files: fileArrayConatiner,
    user: { userID },
    params: { id: productID },
  } = req;

  if (Array.isArray(fileArrayConatiner.imageArray) == true) {
    const imageURLS = [];
    async function uploadImages() {
      // loops through every image the user uploaded and uploads them to cloudinary
      for (let i = 0; i < fileArrayConatiner.imageArray.length; i++) {
        // GET THE IMAGE
        const file = fileArrayConatiner.imageArray[i];
        // UPLOAD THE IMAGE
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
          use_filename: true,
          folder: "Store_Images_uploader",
        });
        // REMOVE THE TEMP FILE
        fs.unlinkSync(file.tempFilePath);
        // PUSH THE IMAGE URL TO THE ARRAY
        imageURLS.push(result.secure_url);
      }
      // CREATE THE PRODUCT
      const product = await Product.create({
        name: name,
        price: price,
        description: description,
        imageArray: imageURLS,
      });
      res.status(200).json({ product });
    }
    uploadImages();
  } else {
    // if the user is only submitting one image for the product
    const imageResult = await cloudinary.uploader.upload(
      fileArrayConatiner.imageArray.tempFilePath,
      {
        use_filename: true,
        folder: "Store_Images_uploader",
      }
    );
    fs.unlinkSync(fileArrayConatiner.imageArray.tempFilePath);
    const product = await Product.create({
      name: name,
      price: price,
      description: description,
      imageArray: imageResult.secure_url,
    });
    res.status(200).json({ product });
  }
};

const getAllProduct = async (req, res) => {
  const products = await Product.find({}).sort("Created at");

  res.status(StatusCodes.OK).json({ products, length: products.length });
};

const deleteProduct = async (req, res) => {
  const {
    params: { id: productID },
    user: { userID },
  } = req;

  const product = await Product.findByIdAndRemove({
    _id: productID,
    user: { userID },
  });

  if (!product) {
    throw new NotFoundError(`No attraction with id: ${productID} found.`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req, res) => {
  // need to make it so that you can upadte the images in the imageARrray
  // try to make it so that the stuff in the image array gets delete
  // also that the images in cloudnary get delete too.

  const {
    body: { name, price, description },
    files: fileArrayContainer,
    user: { userID },
    params: { id: productID },
  } = req;

  if (!name && !price && !description) {
    throw new BadRequestError(
      "Every product needs to have a name, price, and description. So please make sure they have all of them."
    );
  }
  console.log(name, price, description);

  const imageURLS = [];
  console.log(fileArrayContainer);

  const imageResultOne = await cloudinary.uploader.upload(
    fileArrayContainer.imageArray[0].tempFilePath,
    {
      use_filename: true,
      folder: "Store_Images_uploader",
    }
  );
  fs.unlinkSync(fileArrayContainer.imageArray[0].tempFilePath);
  imageURLS.push(imageResultOne.secure_url);

  const product = await Product.findByIdAndUpdate(
    { _id: productID, createdBy: userID }, // How we are finding the product
    { name, price, description, imageURLS }, // Whats changing in the product
    { new: true, runValidators: true } // options
  );
  // console.log(`Image URLS: ${imageURLS}`)

  if (!product) {
    throw new NotFoundError(`No product with id ${productID}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const getSingleProduct = async (req, res) => {
  const {
    user: { userID },
    params: { id: productID },
  } = req;

  const product = await Product.findOne({ createdBy: userID, _id: productID });

  if (!product) {
    throw new NotFoundError(`No product with the ID ${productID}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

module.exports = {
  createProduct,
  getAllProduct,
  deleteProduct,
  updateProduct,
  getSingleProduct,
};
