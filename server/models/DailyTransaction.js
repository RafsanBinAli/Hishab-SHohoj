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
    otherCost: [
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
  },
  myOwnDebt: [
    {
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
  myOwnDebtRepay: [
    {
      amount: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        required: true,
        default: Date.now,
      },
    },
  ],
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
  totalMyOwnDebt: {
    type: Number,
    default: 0,
  },
  totalMyOwnDebtRepay: {
    type: Number,
    default: 0,
  },
  todayDebt: {
    type: Number,
    default: 0,
  },
  todayDebtRepay: {
    type: Number,
    default: 0,
  },
  totalUnpaidDealsPrice: {
    type: Number,
    default: 0,
  },
  totalDebtToShownInFinal:{
    type:Number,
    default:0
  }
});

// Pre-save middleware to calculate totals
transactionSchema.pre("save", function (next) {
  const totalProfit =
    this.credit.dharReturns.reduce((sum, item) => sum + item.amount, 0) +
    this.credit.dokanPayment.reduce((sum, item) => sum + item.amount, 0) +
    this.dailyCashStack +
    this.totalUnpaidDealsPrice +
    this.todayDebt;
  const totalCost =
    this.debit.dhar.reduce((sum, item) => sum + item.amount, 0) +
    this.debit.farmersPayment.reduce((sum, item) => sum + item.amount, 0) +
    this.debit.otherCost.reduce((sum, item) => sum + item.amount, 0) +
    this.todayDebtRepay;

  const netProfit = totalProfit - totalCost;

  const totalDebts = this.totalDebtsOfShops + this.totalDebtsOfFarmers;

  const totalMyOwnDebt = this.myOwnDebt.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  const totalMyOwnDebtRepay = this.myOwnDebtRepay.reduce(
    (sum, item) => sum + item.amount,
    0
  );

  this.totalProfit = totalProfit;
  this.totalCost = totalCost;
  this.netProfit = netProfit;
  this.totalDebts = totalDebts;
  this.totalMyOwnDebt = totalMyOwnDebt;
  this.totalMyOwnDebtRepay = totalMyOwnDebtRepay;

  next();
});

const Transaction = mongoose.model("DailyTransaction", transactionSchema);

module.exports = Transaction;
