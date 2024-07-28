const DailyTransaction = require("../models/DailyTransaction");

exports.saveDailyTransaction = async (req, res) => {
  try {
    console.log("req.body ", req.body);
    const commission = Number(req.body.commission);
    const khajna = Number(req.body.khajna);
    const date = new Date();
    const normalizedDate = new Date(date.setHours(0, 0, 0, 0)); // Normalize the date

    let transaction = await DailyTransaction.findOne({ date: normalizedDate });

    if (transaction) {
      transaction.credit.commissions += commission;
      transaction.credit.khajnas += khajna;
    } else {
      transaction = new DailyTransaction({
        date: normalizedDate,
        credit: {
          commissions: commission,
          khajnas: khajna,
        },
      });
    }
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
    const date = new Date();
    const normalizedDate = new Date(date.setHours(0, 0, 0, 0)); // Normalize the date

    let transaction = await DailyTransaction.findOne({ date: normalizedDate });

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
    const date = new Date();
    const normalizedDate = new Date(date.setHours(0, 0, 0, 0)); // Normalize the date

    let transaction = await DailyTransaction.findOne({ date: normalizedDate });
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found for the day!" });
    }

    // Add the new dhar entry
    console.log(transaction.debit);
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
    const date = new Date();
    const normalizedDate = new Date(date.setHours(0, 0, 0, 0)); // Normalize the date

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
    const date = new Date();
    const normalizedDate = new Date(date.setHours(0, 0, 0, 0)); // Normalize the date

    let transaction = await DailyTransaction.findOne({ date: normalizedDate });
    if (!transaction) {
      return res
        .status(404)
        .json({ message: "Transaction not found for the day!" });
    }

    transaction.credit.dokanPayment.push({ name: shopName, amount: amount });

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
