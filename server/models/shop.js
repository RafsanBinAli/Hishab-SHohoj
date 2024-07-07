// models/shop.js

const mongoose = require("mongoose");

const shopSchema = new mongoose.Schema(
  {
    shopName: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    totalDue: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
