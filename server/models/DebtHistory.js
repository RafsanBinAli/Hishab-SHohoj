const mongoose = require("mongoose");

const debtHistorySchema = new mongoose.Schema({
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
    enum: ["debt", "repayment"], // The 'type' field can only be either 'debt' or 'repay'
  },
});

const DebtHistory = mongoose.model("DebtHistory", debtHistorySchema);

module.exports = DebtHistory;
