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

  due: {
    type: Number,
  },
  action: {
    type: String,
    enum: ["newDebt", "repayDebt"],
    required: true,
  }
});

const bankSchema = new mongoose.Schema({
  bankName: {
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
  },
  paymentDue: {
    type: Number,
    default: 0,
  },
  paymentDone: {
    type: Number,
    default: 0,
  },
  lastEditedBy: {
    type: [debtEntrySchema],
  },
});

module.exports = mongoose.model("Bank", bankSchema);
