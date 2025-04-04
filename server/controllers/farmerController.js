const Farmer = require("../models/Farmer");

exports.createFarmer = async (req, res) => {
  const { name, village, imageUrl, phoneNumber } = req.body;

  try {
    const existingFarmer = await Farmer.findOne({ name });
    if (existingFarmer) {
      return res
        .status(400)
        .json({ error: "Farmer with this name already exists." });
    }
    const newFarmer = new Farmer({ name, village, imageUrl, phoneNumber });

    await newFarmer.save();
    res.status(201).json(newFarmer);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.findFarmerByName = async (req, res) => {
  const { name } = req.params;
  try {
    const farmer = await Farmer.findOne({ name });
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.status(200).json(farmer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.findFarmerById = async (req, res) => {
  const { id } = req.params;
  try {
    const farmer = await Farmer.findById(id);
    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }
    res.status(200).json(farmer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.showAllFarmers = async (req, res) => {
  try {
    const farmers = await Farmer.find();
    res.status(200).json(farmers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.updateFarmer = async (req, res) => {
  const { name } = req.params;
  const { newDhar, payGet } = req.body;

  try {
    const farmer = await Farmer.findOne({
      name: new RegExp(`^${name.trim()}$`, "i"),
    });

    if (!farmer) {
      return res
        .status(404)
        .json({ error: `Farmer with name ${name} not found.` });
    }

    const amount = parseFloat(payGet || newDhar || 0);
    const isPayment = Boolean(payGet);

    // Update totals
    if (isPayment) {
      farmer.totalPaid += amount;
    } else {
      farmer.totalDue += amount;
    }

    // Calculate new due amount
    const due = farmer.totalDue - farmer.totalPaid;

    // Create action record
    farmer.lastEditedBy.push({
      editedBy: req.user.username,
      date: new Date(),
      debtAmount: amount,
      due,
      action: isPayment ? "repayDebt" : "newDebt",
    });

    await farmer.save();
    res.status(200).json(farmer);
  } catch (error) {
    console.error("Error updating farmer:", error);
    res.status(500).json({ error: "Failed to update farmer" });
  }
};

exports.updateFarmerById = async (req, res) => {
  try {
    const farmer = await Farmer.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!farmer) {
      return res.status(404).json({ error: `Farmer with ID ${req.params.id} not found.` });
    }

    res.status(200).json(farmer);
  } catch (error) {
    console.error("Error updating farmer by ID:", error);
    res.status(500).json({ error: "Failed to update farmer by ID" });
  }
};
