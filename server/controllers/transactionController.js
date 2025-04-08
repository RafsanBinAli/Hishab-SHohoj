const DailyTransaction = require("../models/DailyTransaction");
const NewDeal = require("../models/NewDeal");
const Shop = require("../models/shop");
const Farmer = require("../models/Farmer");
const DebtHistory = require("../models/DebtHistory");
const logger = require("../utils/logger"); // Added logger import

// IMPORTANT FIX: Instead of calculating normalizedDate once when the module loads,
// create a function to get the current normalized date whenever needed
function getCurrentNormalizedDate() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

exports.saveDailyTransaction = async (req, res) => {
  try {
    logger.info(
      `POST /saveDailyTransaction - Request: ${JSON.stringify(req.body)}`
    );

    const normalizedDate = getCurrentNormalizedDate(); // Get current date

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
      logger.warn(
        `POST /saveDailyTransaction - Transaction not found for date: ${normalizedDate}`
      );
      return res
        .status(204)
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

    logger.info(
      `POST /saveDailyTransaction - Success - Transaction ID: ${transaction._id}`
    );
    res.status(200).json({
      message: "Daily transaction saved successfully.",
      transaction,
    });
  } catch (error) {
    logger.error(`POST /saveDailyTransaction - Error: ${error.message}`, {
      stack: error.stack,
    });
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

    // Normalize the requested date
    const parsedDate = new Date(date);
    const normalizedQueryDate = new Date(
      Date.UTC(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate()
      )
    );

    let transaction = await DailyTransaction.findOne({
      date: normalizedQueryDate,
    });

    if (!transaction) {
      logger.warn(
        `GET /getDailyTransaction - Transaction not found for date: ${normalizedQueryDate}`
      );
      return res
        .status(204)
        .json({ message: "Transaction not found for the day!" });
    }
    res.status(200).json(transaction);
  } catch (error) {
    logger.error(`GET /getDailyTransaction - Error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Failed to get DailyTransaction", error });
  }
};

exports.dharEntry = async (req, res) => {
  try {
    logger.info(`POST /dharEntry - Request: ${JSON.stringify(req.body)}`);

    const normalizedDate = getCurrentNormalizedDate(); // Get current date

    const { farmerName, amount } = req.body;
    if (!farmerName || !amount) {
      logger.warn(
        `POST /dharEntry - Missing required fields: ${
          !farmerName ? "farmerName" : "amount"
        }`
      );
      return res
        .status(400)
        .json({ message: "Farmer name and amount are required" });
    }

    let transaction = await DailyTransaction.findOne({ date: normalizedDate });
    if (!transaction) {
      logger.warn(
        `POST /dharEntry - Transaction not found for date: ${normalizedDate}`
      );
      return res
        .status(204)
        .json({ message: "Transaction not found for the day!" });
    }

    transaction.debit.dhar.push({ name: farmerName, amount: amount });

    await transaction.save();

    logger.info(
      `POST /dharEntry - Success - Transaction ID: ${transaction._id}`
    );
    res
      .status(200)
      .json({ message: "Dhar entry saved successfully", transaction });
  } catch (error) {
    logger.error(`POST /dharEntry - Error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Failed to save dhar details", error });
  }
};

exports.dharRepay = async (req, res) => {
  try {
    logger.info(`POST /dharRepay - Request: ${JSON.stringify(req.body)}`);

    const normalizedDate = getCurrentNormalizedDate(); // Get current date

    const { farmerName, amount } = req.body;
    if (!farmerName || !amount) {
      logger.warn(
        `POST /dharRepay - Missing required fields: ${
          !farmerName ? "farmerName" : "amount"
        }`
      );
      return res
        .status(400)
        .json({ message: "Farmer name and amount are required" });
    }

    let transaction = await DailyTransaction.findOne({ date: normalizedDate });
    if (!transaction) {
      logger.warn(
        `POST /dharRepay - Transaction not found for date: ${normalizedDate}`
      );
      return res
        .status(204)
        .json({ message: "Transaction not found for the day!" });
    }

    transaction.credit.dharReturns.push({ name: farmerName, amount: amount });
    await transaction.save();

    logger.info(
      `POST /dharRepay - Success - Transaction ID: ${transaction._id}`
    );
    res
      .status(200)
      .json({ message: "Dhar entry saved successfully", transaction });
  } catch (error) {
    logger.error(`POST /dharRepay - Error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({ message: "Failed to save dhar details", error });
  }
};

exports.dokanPayment = async (req, res) => {
  try {
    logger.info(`POST /dokanPayment - Request: ${JSON.stringify(req.body)}`);

    const normalizedDate = getCurrentNormalizedDate(); // Get current date

    const { shopName, amount } = req.body;
    if (!shopName || !amount) {
      logger.warn(
        `POST /dokanPayment - Missing required fields: ${
          !shopName ? "shopName" : "amount"
        }`
      );
      return res
        .status(400)
        .json({ message: "Shop name and amount are required" });
    }
    let transaction = await DailyTransaction.findOne({ date: normalizedDate });
    if (!transaction) {
      logger.warn(
        `POST /dokanPayment - Transaction not found for date: ${normalizedDate}`
      );
      return res
        .status(204)
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

    logger.info(
      `POST /dokanPayment - Success - Transaction ID: ${transaction._id}`
    );
    res
      .status(200)
      .json({ message: "Dokan Payment entry saved successfully", transaction });
  } catch (error) {
    logger.error(`POST /dokanPayment - Error: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Failed to save dokan payment details", error });
  }
};

exports.updateDailyCashStack = async (req, res) => {
  try {
    logger.info(
      `PUT /updateDailyCashStack - Request: ${JSON.stringify(req.body)}`
    );

    const normalizedDate = getCurrentNormalizedDate(); // Get current date

    const { dailyCashStack } = req.body;
    let transactionToday = await DailyTransaction.findOne({
      date: normalizedDate,
    });

    if (!transactionToday) {
      logger.warn(
        `PUT /updateDailyCashStack - Transaction not found for date: ${normalizedDate}`
      );
      return res
        .status(204)
        .json({ message: "Transaction not found for the day!" });
    }
    transactionToday.dailyCashStack += dailyCashStack;
    await transactionToday.save();

    logger.info(
      `PUT /updateDailyCashStack - Success - Transaction ID: ${transactionToday._id}`
    );
    res.status(200).json({
      message: "Cash stack updated successfully!",
      transaction: transactionToday,
    });
  } catch (error) {
    logger.error(`PUT /updateDailyCashStack - Error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({
      message: "Failed to update daily cash stack!",
      error: error.message,
    });
  }
};

exports.updateOtherCost = async (req, res) => {
  try {
    logger.info(`PUT /updateOtherCost - Request: ${JSON.stringify(req.body)}`);

    const normalizedDate = getCurrentNormalizedDate(); // Get current date

    const { otherCost } = req.body;
    const transactionToday = await DailyTransaction.findOne({
      date: normalizedDate,
    });

    if (!transactionToday) {
      logger.warn(
        `PUT /updateOtherCost - Transaction not found for date: ${normalizedDate}`
      );
      return res
        .status(204)
        .json({ message: "Transaction not found for the day!" });
    }
    if (
      Array.isArray(otherCost) &&
      otherCost.every((item) => item.name && item.amount !== undefined)
    ) {
      transactionToday.debit.otherCost.push(...otherCost);
      await transactionToday.save();

      logger.info(
        `PUT /updateOtherCost - Success - Transaction ID: ${transactionToday._id}`
      );
      return res.status(200).json({
        message: "Other cost(s) added successfully!",
        transaction: transactionToday,
      });
    } else {
      logger.warn(
        `PUT /updateOtherCost - Invalid input format: ${JSON.stringify(
          otherCost
        )}`
      );
      return res.status(400).json({
        message:
          "Invalid other cost format! Expected an array of objects with 'name' and 'cost'.",
      });
    }
  } catch (error) {
    logger.error(`PUT /updateOtherCost - Error: ${error.message}`, {
      stack: error.stack,
    });
    res.status(500).json({
      message: "Failed to add other costs!",
      error: error.message,
    });
  }
};

exports.createDaily = async (req, res) => {
  try {
    logger.info(`POST /createDaily - Request: ${JSON.stringify(req.body)}`);

    const normalizedDate = getCurrentNormalizedDate(); // Get current date

    const previousDayDate = new Date(normalizedDate);
    previousDayDate.setDate(previousDayDate.getDate() - 1);

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
      logger.warn(
        `POST /createDaily - Transaction already exists for date: ${normalizedDate}`
      );
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

    logger.info(
      `POST /createDaily - Success - Transaction ID: ${transaction._id}, Date: ${normalizedDate}`
    );
    res
      .status(200)
      .json({ message: "DailyTransaction created successfully", transaction });
  } catch (error) {
    logger.error(`POST /createDaily - Error: ${error.message}`, {
      stack: error.stack,
    });
    res
      .status(500)
      .json({ message: "Failed to create DailyTransaction", error });
  }
};

exports.updateMyOwnDebt = async (req, res) => {
  let type;
  try {
    logger.info(`PUT /updateMyOwnDebt - Request: ${JSON.stringify(req.body)}`);

    const normalizedDate = getCurrentNormalizedDate(); // Get current date

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
      logger.warn(
        `PUT /updateMyOwnDebt - Transaction not found for date: ${normalizedDate}`
      );
      return res
        .status(204)
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
      logger.warn(`PUT /updateMyOwnDebt - Invalid type: ${type}`);
      return res.status(400).json({ message: "Invalid type provided!" });
    }

    await transactionToday.save();
    await newDebtHistory.save();

    logger.info(
      `PUT /updateMyOwnDebt - Success - Transaction ID: ${transactionToday._id}, DebtHistory ID: ${newDebtHistory._id}`
    );
    res.status(200).json({
      message: `My own ${type} updated successfully!`,
      transaction: transactionToday,
    });
  } catch (error) {
    logger.error(`PUT /updateMyOwnDebt - Error: ${error.message}`, {
      stack: error.stack,
    });
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
    logger.error(
      `GET /calculateCommissionAndKhajna - Error: ${error.message}`,
      { stack: error.stack }
    );
    res.status(500).json({
      message: "Failed to calculate commission and khajna!",
      error: error.message,
    });
  }
};

exports.addUnpaidDeal = async (req, res) => {
  try {
    logger.info(`POST /addUnpaidDeal - Request: ${JSON.stringify(req.body)}`);

    const normalizedDate = getCurrentNormalizedDate(); // Get current date
    logger.info(`Current normalized date: ${normalizedDate}`);

    const unpaidDealPrice = Number(req.body.totalUnpaidDealsPrice);
    const farmerName = req.body.name;

    if (isNaN(unpaidDealPrice)) {
      logger.warn(
        `POST /addUnpaidDeal - Invalid price format: ${req.body.unpaidDealPrice}`
      );
      return res
        .status(400)
        .json({ message: "Total unpaid deals price must be a valid number." });
    }

    let transaction = await DailyTransaction.findOne({
      date: normalizedDate,
    });

    if (!transaction) {
      logger.warn(
        `POST /addUnpaidDeal - Transaction not found for date: ${normalizedDate}`
      );
      return res
        .status(204)
        .json({ message: "Transaction Details not found!" });
    }

    transaction.totalUnpaidDealsPrice += unpaidDealPrice;

    // Check if farmer already exists in the unpaidDeals array
    const existingFarmerIndex = transaction.unpaidDeals.findIndex(
      (deal) => deal.name === farmerName
    );

    if (existingFarmerIndex !== -1) {
      // Convert both current amount and new price to numbers before adding
      transaction.unpaidDeals[existingFarmerIndex].amount =
        Number(transaction.unpaidDeals[existingFarmerIndex].amount) +
        Number(unpaidDealPrice);
    } else {
      console.log("No Farmer Found!");
      // Farmer doesn't exist, add a new entry
      transaction.unpaidDeals.push({
        name: farmerName,
        amount: unpaidDealPrice,
      });
    }

    // Update total regardless of whether it's a new or existing farmer
    transaction.totalUnpaidDealsPrice += unpaidDealPrice;

    await transaction.save();

    logger.info(
      `POST /addUnpaidDeal - Success - Transaction ID: ${transaction._id}`
    );
    res.status(200).json({
      message: "Unpaid deals total updated successfully",
      transaction,
    });
  } catch (error) {
    logger.error(`POST /addUnpaidDeal - Error: ${error.message}`, {
      stack: error.stack,
    });
    console.error("Error updating unpaid deals total:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.subUnpaidDeal = async (req, res) => {
  try {
    logger.info(`POST /subUnpaidDeal - Request: ${JSON.stringify(req.body)}`);

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
      logger.info(`Using provided date: ${date}`);
    } else {
      date = getCurrentNormalizedDate(); // Get current date
      logger.info(`Using current date: ${date}`);
    }

    const totalUnpaidDealsPrice = Number(req.body.totalUnpaidDealsPrice);

    if (isNaN(totalUnpaidDealsPrice)) {
      logger.warn(
        `POST /subUnpaidDeal - Invalid price format: ${req.body.totalUnpaidDealsPrice}`
      );
      return res
        .status(400)
        .json({ message: "Total unpaid deals price must be a valid number." });
    }

    let transaction = await DailyTransaction.findOne({
      date,
    });

    if (!transaction) {
      logger.warn(
        `POST /subUnpaidDeal - Transaction not found for date: ${date}`
      );
      return res
        .status(204)
        .json({ message: "Transaction Details not found!" });
    }

    transaction.totalUnpaidDealsPrice -= totalUnpaidDealsPrice;

    await transaction.save();

    logger.info(
      `POST /subUnpaidDeal - Success - Transaction ID: ${transaction._id}`
    );
    res.status(200).json({
      message: "Unpaid deals total updated successfully",
      transaction,
    });
  } catch (error) {
    logger.error(`POST /subUnpaidDeal - Error: ${error.message}`, {
      stack: error.stack,
    });
    console.error("Error updating unpaid deals total:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
