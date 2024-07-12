const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  farmerName: {
    type: String,
    required: true,
  },
  stockName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
});

const slipSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    index: true,
  },
  purchases: {
    type: [purchaseSchema],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  dueAmount: {
    type: Number,
    
    default:0,
   
  },
  isEdited: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("Slip", slipSchema);
