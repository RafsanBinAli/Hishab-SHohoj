const Bank = require("../models/Bank");

// Create a new bank
exports.createBank = async (req, res) => {
  const { bankName, village, imageUrl, phoneNumber } = req.body;
  try {
    const existingBank = await Bank.findOne({ bankName });

    if (existingBank) {
      return res
        .status(400)
        .json({ error: "Bank with this name already exists." });
    }

    const newBank = new Bank({
      bankName,
      village,
      imageUrl,
      phoneNumber,
      status: true,
    }); // Default status to true

    await newBank.save();

    res.status(201).json(newBank);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

// Find a bank by its name
exports.findBankByName = async (req, res) => {
  const { bankName } = req.params;
  try {
    const bank = await Bank.findOne({ bankName });
    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }
    res.status(200).json(bank);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Fetch all banks
exports.showAllBanks = async (req, res) => {
  try {
    const banks = await Bank.find(); // Fetch all banks regardless of status
    res.status(200).json(banks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update the status of a bank by its name
exports.updateEntryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Expecting true or false

  try {
    const debt = await Debt.findById(id);

    if (!debt) {
      return res.status(404).json({ message: "Debt entry not found" });
    }

    debt.status = status;
    await debt.save();

    res.status(200).json({ message: `Entry status updated to ${status}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update bank debt and add a debt entry by bank name
exports.updateBankDebtByName = async (req, res) => {
  const { bankName } = req.params;
  const { editedBy, debtAmount, action } = req.body;

  try {
    const bank = await Bank.findOne({ bankName });

    if (!bank) {
      return res.status(404).json({ message: "Bank not found" });
    }

    // Check if the bank is active when updating debt
    if (bank.status === false) {
      return res
        .status(400)
        .json({ message: "Bank is inactive and cannot update debt" });
    }

    const debtEntry = {
      editedBy,
      debtAmount,
      action,
      date: new Date(),
      status: true,
    };

    if (action === "repayDebt") {
      bank.paymentDue -= debtAmount;
      bank.paymentDone += debtAmount;
    } else if (action === "newDebt") {
      bank.paymentDue += debtAmount;
    } else {
      return res.status(400).json({ message: "Invalid action type" });
    }

    bank.lastEditedBy.push(debtEntry);

    await bank.save();

    res.status(200).json(bank);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Controller method to fetch own debt with status true
exports.getOwnDebt = async (req, res) => {
  try {
    // Fetch only entries with status: true
    const debtData = await Debt.find({ status: true });
    res.status(200).json(debtData);
  } catch (error) {
    console.error("Error fetching debt data:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
