
const path = require("path")
const fs = require("fs")
const cloudinary = require("cloudinary").v2;

const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const Product = require("../Model/ProductSchema");



const createProduct = async (req, res) => {
  // req.body.createdBy = req.user.userID;

  const { name, price, description } = req.body;

  const imageArray = req.files.imageArray;
  const imageURLS = [];
  const imageResultOne = await cloudinary.uploader.upload(
    req.files.imageArray[0].tempFilePath,
    {
      use_filename: true,
      folder: "Store_Images_uploader"
    },
  );
  fs.unlinkSync(req.files.imageArray[0].tempFilePath);
  imageURLS.push(imageResultOne.secure_url);

  const imageResultTwo = await cloudinary.uploader.upload(
    req.files.imageArray[1].tempFilePath,
    {
      use_filename: true,
      folder: "Store_Images_uploader"
    },
  );
  fs.unlinkSync(req.files.imageArray[1].tempFilePath);
  imageURLS.push(imageResultTwo.secure_url);
  

  // console.log({ name: name, price: price, description: description, $push: {image: imageURLS} })
  const product = await Product.create({ name: name, price: price, description: description, imageArray: imageURLS  });
  res.status(200).json({ product })
}

const getAllProduct = async (req, res) => {
  const products = await Product.find({}).sort("Created at");

  res.status(StatusCodes.OK).json({ products, length: products.length });
}

const deleteProduct = async (req, res) => {
  const {
    params: { id: productID },
    user: { userID },
  } = req;

  const product = await Product.findByIdAndRemove({ _id: productID });

  if (!product) {
    throw new NotFoundError(`No attraction with id: ${productID} found.`);
  }

  res.status(StatusCodes.OK).json({ product });
}

const updateProduct = async (req, res) => {

  // need to make it so that you can upadte the images in the imageARrray
  // try to make it so that the stuff in the image array gets delete
    // also that the images in cloudnary get delete too.

  const {
    body: { name, price, description, },
    files: imageArray,
    user: { userID },
    params: { id: productID },
  } = req;

  if (!name || !price || !description ) {
    throw new BadRequestError(
      "Every product needs to have a name, price, and description. So please make sure they have all of them."
    );
  }
  console.log(imageArray);

  const imageURLS = [];
  const imageResultOne = await cloudinary.uploader.upload(
    imageArray[0].tempFilePath,
    {
      use_filename: true,
      folder: "Store_Images_uploader"
    },
  );
  fs.unlinkSync(imageArray[0].tempFilePath);
  imageURLS.push(imageResultOne.secure_url);

  const product = await Product.findByIdAndUpdate(
    { _id: productID }, // How we are finding the product
    {name, price, description, imageURLS}, // Whats changing in the product
    { new: true, runValidators: true } // options
  );

  if (!product) {
    throw new NotFoundError(`No product with id ${productID}`);
  }

  res.status(StatusCodes.OK).json({ product });
}

const getSingleProduct = async (req, res) => {
  res.json({ data: "GetSingleProduct" });
}

module.exports = { createProduct, getAllProduct, deleteProduct, updateProduct, getSingleProduct };