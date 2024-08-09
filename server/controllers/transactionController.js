const DailyTransaction = require("../models/DailyTransaction");
const date = new Date();
const normalizedDate = new Date(
  Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
);
const Shop = require("../models/shop");
const Farmer = require("../models/Farmer")

exports.saveDailyTransaction = async (req, res) => {
  try {
    const commission = Number(req.body.commission);
    const khajna = Number(req.body.khajna);

    let transaction = await DailyTransaction.findOne({ date: normalizedDate });

    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found for the day!" });
    }
    transaction.credit.commissions += commission;
    transaction.credit.khajnas += khajna;

    if (req.body.name && req.body.amount) {
      transaction.debit.farmersPayment.push({
        name: req.body.name,
        amount: req.body.amount,
      });
    }

    await transaction.save();
    res
      .status(200)
      .json({ message: "DailyTransaction saved successfully", transaction });
  } catch (error) {
    res.status(500).json({ message: "Failed to save DailyTransaction", error });
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
    console.log(transaction);
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
    transactionToday.dailyCashStack = dailyCashStack;
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
    let transactionToday = await DailyTransaction.findOne({
      date: normalizedDate,
    });

    if (!transactionToday) {
      return res
        .status(404)
        .json({ message: "Transaction not found for the day!" });
    }
    transactionToday.debit.otherCost = otherCost;
    await transactionToday.save();

    res.status(200).json({
      message: "Other cost  updated successfully!",
      transaction: transactionToday,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update other costs!",
      error: error.message,
    });
  }
};

exports.createDaily = async (req, res) => {
  try {
    let transactionToday = await DailyTransaction.findOne({
      date: normalizedDate,
    });
    if (transactionToday) {
      return res
        .status(400)
        .json({ message: "Already exists transaction for the day!" });
    }
    const allShops = await Shop.find({});
    const totalDebtsOfShops = allShops.reduce((sum, shop) => sum + shop.totalDue, 0);

    const allFarmers = await Farmer.find({});
    const totalDebtsOfFarmers = allFarmers.reduce((sum, farmer) => sum + farmer.totalDue, 0);

    transaction = new DailyTransaction({
      date: normalizedDate,
      totalDebtsOfShops,
      totalDebtsOfFarmers,
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