const monogoose = require("mongoose");

const StoreSchema = new monogoose.Schema({
  name: {
    type: String,
    required: [false, "Store name is required"],
  },
  businessEmail: {
    type: String,
    required: [false, "Business email is required"],
  },
  storeOwnerID: {
    type: String,
    required: [false, "Store owner ID is required"],
  },
  storeOwnerName: {
    type: String,
    required: [false, "Store owner name is required"],
  },
  logo: {
    type: String,
    required: [false, "Store logo is not required, but should have one"],
  },

  description: {
    type: String,
    required: [false, "Please add a description"],
    maxlength: [500, "Description must be less than 500 characters"],
    minlength: [3, "Description must be more than 3 characters"],
  },
  products: [
    {
      type: Object,
      ref: "Product",
      required: [false, "Products are not required, but should have one"],
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  likes: {
    type: Number,
    default: 0,
  },
});

module.exports = monogoose.model("Store", StoreSchema);
