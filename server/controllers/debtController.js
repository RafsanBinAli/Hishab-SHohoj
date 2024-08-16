const DebtHistory = require("../models/DebtHistory");

// Get all debt entries
exports.getAllDebtEntries = async (req, res) => {
  try {
    // Fetch all records from DebtHistory collection
    const debtEntries = await DebtHistory.find({});
    
    // Send the response with all debt entries
    res.status(200).json(debtEntries);
  } catch (error) {
    // Handle any errors that occur during the operation
    res.status(500).json({
      message: "Failed to fetch debt history records!",
      error: error.message,
    });
  }
};

// Create a new debt entry
exports.createDebtEntry = async (req, res) => {
  try {
    const { date, amount, type } = req.body;

    // Create a new debt entry instance
    const newDebtEntry = new DebtHistory({
      date,
      amount,
      type,
    });

    // Save the new debt entry to the database
    await newDebtEntry.save();

    // Send the response indicating success
    res.status(201).json({
      message: "Debt entry created successfully!",
      debtEntry: newDebtEntry,
    });
  } catch (error) {
    // Handle any errors that occur during the operation
    res.status(500).json({
      message: "Failed to create debt entry!",
      error: error.message,
    });
  }
};

// Other CRUD operations like update and delete can be added similarly
