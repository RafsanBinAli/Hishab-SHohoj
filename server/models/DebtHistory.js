const mongoose = require("mongoose");

const debtHistorySchema = new mongoose.Schema({
  bankName: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["debt", "repayment"], 
  },
});

const DebtHistory = mongoose.model("DebtHistory", debtHistorySchema);

module.exports = DebtHistory;
