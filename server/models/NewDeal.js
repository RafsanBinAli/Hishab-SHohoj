const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  stockName: {
    type: String,
    required: true,
  },
});
// Define a virtual property 'total' to calculate price * quantity
purchaseSchema.virtual("total").get(function () {
  return this.price * this.quantity;
});

// Ensure virtual fields are included in toJSON output
purchaseSchema.set("toJSON", { virtuals: true });

const stockSchema = new mongoose.Schema({
  stockName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const newDealSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Farmer",
      required: true,
    },
    farmerName: {
      type: String,
      required: true,
    },
    stock: {
      type: [stockSchema],
      default:[]
    },
    purchases: {
      type: [purchaseSchema],
      default: [],
    },
  },
  {
    timestamps: true, // This option adds createdAt and updatedAt fields automatically
  }
);

module.exports = mongoose.model("NewDeal", newDealSchema);
