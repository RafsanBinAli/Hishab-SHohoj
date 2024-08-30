const DebtHistory = require("../models/DebtHistory");


exports.getAllDebtEntries = async (req, res) => {
  try {
    const debtEntries = await DebtHistory.find({});
    
    res.status(200).json(debtEntries);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch debt history records!",
      error: error.message,
    });
  }
};


exports.createDebtEntry = async (req, res) => {
  try {
    const { date, amount, type } = req.body;
    const newDebtEntry = new DebtHistory({
      date,
      amount,
      type,
    });

    await newDebtEntry.save();
    res.status(201).json({
      message: "Debt entry created successfully!",
      debtEntry: newDebtEntry,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create debt entry!",
      error: error.message,
    });
  }
};

