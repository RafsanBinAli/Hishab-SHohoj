const mongoose = require("mongoose");
const { Schema } = mongoose;

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

  totalProfit: {
    type: Number,
    default: 0,
  },
  totalCost: {
    type: Number,
    default: 0,
  },
  netProfit: {
    type: Number,
    default: 0,
  },
  dailyCashStack: {
    type: Number,
    default: 0,
  },
  totalDebtsOfShops: {
    type: Number,
    default: 0,
  },
  totalDebtsOfFarmers: {
    type: Number,
    default: 0,
  },
  totalDebts: {
    type: Number,
    default: 0,
  },
});

// Pre-save middleware to calculate totalProfit, totalCost, netProfit, and totalDebts
transactionSchema.pre("save", function (next) {
  const totalProfit =
    this.credit.dharReturns.reduce((sum, item) => sum + item.amount, 0) +
    this.credit.dokanPayment.reduce((sum, item) => sum + item.amount, 0) +
    this.credit.commissions +
    this.credit.khajnas;

  const totalCost =
    this.debit.dhar.reduce((sum, item) => sum + item.amount, 0) +
    this.debit.farmersPayment.reduce((sum, item) => sum + item.amount, 0) +
    this.debit.otherCost;

  const netProfit = totalProfit - totalCost;

  const totalDebts = this.totalDebtsOfShops + this.totalDebtsOfFarmers;

  this.totalProfit = totalProfit;
  this.totalCost = totalCost;
  this.netProfit = netProfit;
  this.totalDebts = totalDebts;

  next();
});

const Transaction = mongoose.model("DailyTransaction", transactionSchema);

module.exports = Transaction;
