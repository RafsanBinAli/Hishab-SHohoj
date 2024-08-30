const Bank = require("../models/Bank");

exports.createBank = async (req, res) => {
  const { bankName, village, imageUrl, phoneNumber } = req.body;
  try {
    const existingBank = await Bank.findOne({ bankName });

    if (existingBank) {
      return res
        .status(400)
        .json({ error: "Bank with this name already exists." });
    }

    const newBank = new Bank({ bankName, village, imageUrl, phoneNumber });

    await newBank.save();

    res.status(201).json(newBank);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

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

exports.showAllBanks = async (req, res) => {
  try {
    const banks = await Bank.find();
    res.status(200).json(banks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
