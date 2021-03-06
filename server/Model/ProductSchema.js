const { truncate } = require("fs/promises");
const monogoose = require("mongoose");

const ProductSchema = new monogoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  price: {
    type: Number,
    required: [true, "Product must have a price"],
  },
  type: [
    {
      type: String,
      required: true,
      enum: {
        values: [
          "toy",
          "art",
          "entertainment",
          "clothing",
          "craft supplies",
          "Tools",
          "party",
          "jewelry",
          "accessories",
        ],
        message: `{Value} is not supported. Also make sure that there are: no spaces in your type string and every letter is lowercase`,
      },
    },
  ],

  target: [
    {
      type: String,
      required: true,
      enum: {
        values: ["kids", "teens", "adults", "netural"],
        message: `{Value} is not supported. Also make sure that there are: no spaces in your type string and every letter is lowercase`,
      },
    },
  ],

  description: {
    type: String,
    required: [true, "Please add a description"],
    maxlength: [50, "Description must be less than 500 characters"],
    minlength: [3, "Description must be more than 3 characters"],
  },
  imageArray: [
    {
      type: String,
      required: [true, "Please add an image that displays the product"],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    required: false,
    default: 0,
  },

  createdBy: {
    type: monogoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please add a store"],
  },

  // for cart only
  quantity: {
    type: Number,
    required: false,
    default: 1,
  },
});

ProductSchema.pre("validate", function (next) {
  if (this.imageArray.length > 10)
    throw "Amount of images submited exceeds maximum size of 10 images. Please remove some images and try again.";

  this.likes = 0;
  next();
});

module.exports = monogoose.model("Product", ProductSchema);
