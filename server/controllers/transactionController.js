const DailyTransaction = require("../models/DailyTransaction");
const NewDeal = require("../models/NewDeal");
const Shop = require("../models/shop");
const Farmer = require("../models/Farmer");
const DebtHistory = require("../models/DebtHistory");
const moment = require("moment");
const date = new Date();
const normalizedDate = new Date(
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
);

exports.saveDailyTransaction = async (req, res) => {
  try {
    const {
      name,
      amount: amountStr,
      commission: commissionStr,
      khajna: khajnaStr,
      date,
    } = req.body;

    const amount = Number(amountStr);
    const commission = Number(commissionStr);
    const khajna = Number(khajnaStr);
    const dateInput = date ? new Date(date) : new Date();
    const dateOfTransaction = new Date(
      Date.UTC(
        dateInput.getFullYear(),
        dateInput.getMonth(),
        dateInput.getDate()
      )
    );
    
    let transaction = await DailyTransaction.findOne({
      date: normalizedDate,
    });

    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found for the specified date." });
    }

    if (dateOfTransaction.getTime() !== normalizedDate.getTime()) {
      transaction.debit.farmersPaymentLater.push({ name, amount });
      transaction.credit.commissions += commission;
      transaction.credit.khajnas += khajna;
    } else {
      transaction.credit.commissions += commission;
      transaction.credit.khajnas += khajna;

      if (name) {
        const existingEntry = transaction.debit.farmersPayment.find(
          (entry) => entry.name === name
        );

        if (existingEntry) {
          existingEntry.amount = amount;
        } else {
          transaction.debit.farmersPayment.push({ name, amount });
        }
      }
    }

    await transaction.save();

    res.status(200).json({
      message: "Daily transaction saved successfully.",
      transaction,
    });
  } catch (error) {
    console.error("Error while saving daily transaction:", error.message);
    res.status(500).json({
      message: "An error occurred while saving the daily transaction.",
      error: error.message,
    });
  }
};

exports.getDailyTransaction = async (req, res) => {
  try {
    const { date } = req.params;
    let transaction = await DailyTransaction.findOne({ date });

    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found for the day!" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    res.status(500).json({ message: "Failed to save DailyTransaction", error });
  }
};

exports.dharEntry = async (req, res) => {
  try {
    const { farmerName, amount } = req.body;
    if (!farmerName || !amount) {
      return res
        .status(400)
        .json({ message: "Farmer name and amount are required" });
    }

    let transaction = await DailyTransaction.findOne({ date: normalizedDate });
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found for the day!" });
    }

    transaction.debit.dhar.push({ name: farmerName, amount: amount });

    await transaction.save();

    res
      .status(200)
      .json({ message: "Dhar entry saved successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Failed to save dhar details", error });
  }
};

exports.dharRepay = async (req, res) => {
  try {
    const { farmerName, amount } = req.body;
    if (!farmerName || !amount) {
      return res
        .status(400)
        .json({ message: "Farmer name and amount are required" });
    }

    let transaction = await DailyTransaction.findOne({ date: normalizedDate });
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found for the day!" });
    }

    transaction.credit.dharReturns.push({ name: farmerName, amount: amount });
    await transaction.save();
    res
      .status(200)
      .json({ message: "Dhar entry saved successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Failed to save dhar details", error });
  }
};

exports.dokanPayment = async (req, res) => {
  try {
    const { shopName, amount } = req.body;
    if (!shopName || !amount) {
      return res
        .status(400)
        .json({ message: "Shop name and amount are required" });
    }
    let transaction = await DailyTransaction.findOne({ date: normalizedDate });
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found for the day!" });
    }
    const shopEntry = transaction.credit.dokanPayment.find(
      (entry) => entry.name === shopName
    );

    if (shopEntry) {
      shopEntry.amount += amount;
    } else {
      transaction.credit.dokanPayment.push({ name: shopName, amount });
    }
    await transaction.save();
    res
      .status(200)
      .json({ message: "Dokan Payment entry saved successfully", transaction });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to save dokan payment details", error });
  }
};

exports.updateDailyCashStack = async (req, res) => {
  try {
    const { dailyCashStack } = req.body;
    let transactionToday = await DailyTransaction.findOne({
      date: normalizedDate,
    });

    if (!transactionToday) {
      return res
        .status(404)
        .json({ message: "Transaction not found for the day!" });
    }
    transactionToday.dailyCashStack += dailyCashStack;
    await transactionToday.save();
    res.status(200).json({
      message: "Cash stack updated successfully!",
      transaction: transactionToday,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update daily cash stack!",
      error: error.message,
    });
  }
};

exports.updateOtherCost = async (req, res) => {
  try {
    const { otherCost } = req.body;
    const transactionToday = await DailyTransaction.findOne({
      date: normalizedDate,
    });

    if (!transactionToday) {
      return res
        .status(404)
        .json({ message: "Transaction not found for the day!" });
    }
    if (
      Array.isArray(otherCost) &&
      otherCost.every((item) => item.name && item.amount !== undefined)
    ) {
      transactionToday.debit.otherCost.push(...otherCost);
      await transactionToday.save();

      return res.status(200).json({
        message: "Other cost(s) added successfully!",
        transaction: transactionToday,
      });
    } else {
      return res.status(400).json({
        message:
          "Invalid other cost format! Expected an array of objects with 'name' and 'cost'.",
      });
    }
  } catch (error) {
    res.status(500).json({
      message: "Failed to add other costs!",
      error: error.message,
    });
  }
};

exports.createDaily = async (req, res) => {
  const previousDayDate = new Date(normalizedDate);
  previousDayDate.setDate(previousDayDate.getDate() - 1);

  try {
    let transactionToday = await DailyTransaction.findOne({
      date: normalizedDate,
    });
    let previousDayTransaction = await DailyTransaction.findOne({
      date: previousDayDate,
    });
    let dailyCashStack = 0;
    if (previousDayTransaction) {
      dailyCashStack = previousDayTransaction.netProfit || 0;
    }
    if (transactionToday) {
      return res
        .status(400)
        .json({ message: "Already exists transaction for the day!" });
    }

    const allShops = await Shop.find({});
    const totalDebtsOfShops = allShops.reduce(
      (sum, shop) => sum + shop.totalDue,
      0
    );

    const allFarmers = await Farmer.find({});
    const totalDebtsOfFarmers = allFarmers.reduce(
      (sum, farmer) => sum + farmer.totalDue,
      0
    );
    const unpaidDeals = await NewDeal.find({ doneStatus: false });
    const totalUnpaidDealsPrice = unpaidDeals.reduce((sum, deal) => {
      return (
        sum + deal.purchases.reduce((acc, purchase) => acc + purchase.total, 0)
      );
    }, 0);
    const debtHistory = await DebtHistory.find({
      date: { $lte: normalizedDate },
    });
    const totalDebtToShownInFinal = debtHistory.reduce((total, entry) => {
      if (entry.type === "debt") {
        return total + entry.amount;
      } else if (entry.type === "repayment") {
        return total - entry.amount;
      }
      return total;
    }, 0);

    transaction = new DailyTransaction({
      date: normalizedDate,
      totalDebtsOfShops,
      totalDebtsOfFarmers,
      totalUnpaidDealsPrice,
      dailyCashStack,
      totalDebtToShownInFinal,
    });

    await transaction.save();
    res
      .status(200)
      .json({ message: "DailyTransaction created successfully", transaction });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create DailyTransaction", error });
  }
};

exports.updateMyOwnDebt = async (req, res) => {
  let type;
  try {
    const { amount, bank } = req.body;
    type = req.body.type;

    const newDebtHistory = new DebtHistory({
      date: normalizedDate,
      amount,
      type,
      bankName: bank,
    });

    let transactionToday = await DailyTransaction.findOne({
      date: normalizedDate,
    });

    if (!transactionToday) {
      return res
        .status(404)
        .json({ message: "Transaction not found for the day!" });
    }

    if (type === "debt") {
      transactionToday.todayDebt += amount;
      transactionToday.totalDebtToShownInFinal += amount;
      transactionToday.myOwnDebt.push({ amount, date: normalizedDate });
      transactionToday.totalMyOwnDebt = transactionToday.myOwnDebt.reduce(
        (sum, debt) => sum + debt.amount,
        0
      );
    } else if (type === "repayment") {
      transactionToday.todayDebtRepay += amount;
      transactionToday.totalDebtToShownInFinal -= amount;
      transactionToday.myOwnDebtRepay.push({ amount, date: normalizedDate });
      transactionToday.totalMyOwnDebtRepay =
        transactionToday.myOwnDebtRepay.reduce(
          (sum, repayment) => sum + repayment.amount,
          0
        );
    } else {
      return res.status(400).json({ message: "Invalid type provided!" });
    }

    await transactionToday.save();
    await newDebtHistory.save();

    res.status(200).json({
      message: `My own ${type} updated successfully!`,
      transaction: transactionToday,
    });
  } catch (error) {
    res.status(500).json({
      message: `Failed to update my own ${type}!`,
      error: error.message,
    });
  }
};

exports.calculateCommissionAndKhajna = async (req, res) => {
  try {
    const { date1, date2 } = req.query;

    const startDate = new Date(date1);
    const endDate = new Date(date2);
    let totalCommission = 0;
    let totalKhajna = 0;
    let totalOtherCost = 0;

    const transactions = await DailyTransaction.find({
      date: {
        $gte: startDate,
        $lte: endDate,
      },
    });

    transactions.forEach((transaction) => {
      totalCommission += transaction.credit.commissions || 0;
      totalKhajna += transaction.credit.khajnas || 0;

      if (transaction.debit && transaction.debit.otherCost) {
        totalOtherCost += transaction.debit.otherCost.reduce(
          (sum, item) => sum + item.amount,
          0
        );
      }
    });

    res.status(200).json({
      totalCommission,
      totalKhajna,
      totalOtherCost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to calculate commission and khajna!",
      error: error.message,
    });
  }
};

exports.addUnpaidDeal = async (req, res) => {
  try {
    const totalUnpaidDealsPrice = Number(req.body.totalUnpaidDealsPrice);

    if (isNaN(totalUnpaidDealsPrice)) {
      return res
        .status(400)
        .json({ message: "Total unpaid deals price must be a valid number." });
    }

    let transaction = await DailyTransaction.findOne({
      date: normalizedDate,
    });
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction Details not found!" });
    }

    transaction.totalUnpaidDealsPrice += totalUnpaidDealsPrice;

    await transaction.save();

    res.status(200).json({
      message: "Unpaid deals total updated successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error updating unpaid deals total:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.subUnpaidDeal = async (req, res) => {
  try {
    let date;
    if (!!req.body.date) {
      const providedDate = new Date(req.body.date);
      date = new Date(
        Date.UTC(
          providedDate.getFullYear(),
          providedDate.getMonth(),
          providedDate.getDate()
        )
      );
      console.log(date);
    } else {
      date = normalizedDate;
    }
    const totalUnpaidDealsPrice = Number(req.body.totalUnpaidDealsPrice);
    console.log(totalUnpaidDealsPrice);
    if (isNaN(totalUnpaidDealsPrice)) {
      return res
        .status(400)
        .json({ message: "Total unpaid deals price must be a valid number." });
    }

    let transaction = await DailyTransaction.findOne({
      date,
    });
    console.log(transaction);
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction Details not found!" });
    }

    transaction.totalUnpaidDealsPrice -= totalUnpaidDealsPrice;

    await transaction.save();

    res.status(200).json({
      message: "Unpaid deals total updated successfully",
      transaction,
    });
  } catch (error) {
    console.error("Error updating unpaid deals total:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
