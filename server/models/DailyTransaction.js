const mongoose = require("mongoose");
const { Schema } = mongoose;

// Define the schema for transactions
const transactionSchema = new Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  credit: {
    dharReturns: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    dokanPayment: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    commissions: {
      type: Number,
      default: 0,
    },
    khajnas: {
      type: Number,
      default: 0,
    },
  },
  debit: {
    dhar: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    farmersPayment: [
      {
        name: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
      },
    ],
    otherCost: {
      type: Number,
      default: 0,
    },
  },
});

// Create the model from the schema
const Transaction = mongoose.model("DailyTransaction", transactionSchema);

module.exports = Transaction;
