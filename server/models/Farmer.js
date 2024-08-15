const mongoose = require("mongoose");

const debtEntrySchema = new mongoose.Schema({
  editedBy: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
    required: true,
  },
  debtAmount: {
    type: Number,
    required: true,
  },
  action: {
    type: String,
    enum: ["newDebt", "repayDebt"],
    required: true,
  },
});

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
  },
  village: {
    type: String,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  totalDue: {
    type: Number,
    default: 0,
  },
  totalPaid: {
    type: Number,
    default: 0,
  },
  lastEditedBy: {
    type: [debtEntrySchema], // Array of debt entries
  },
});

module.exports = mongoose.model("Farmer", farmerSchema);
