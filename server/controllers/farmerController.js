const Farmer = require("../models/Farmer");

exports.createFarmer = async (req, res) => {
  console.log(req.body);
  const { name, village, imageUrl, phoneNumber } = req.body;

  try {
    // Check if a farmer with the same name already exists
    const existingFarmer = await Farmer.findOne({ name });

    if (existingFarmer) {
      return res
        .status(400)
        .json({ error: "Farmer with this name already exists." });
    }

    // Create a new farmer instance
    const newFarmer = new Farmer({ name, village, imageUrl, phoneNumber });

    // Save the new farmer to the database
    await newFarmer.save();

    // Respond with success message and new farmer data
    res.status(201).json(newFarmer);
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.findFarmerByName = async (req, res) => {
  const { name } = req.params; // Assuming name is passed as a route parameter
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
    const farmer = await Farmer.findOne({ name });
    if (!farmer) {
      return res.status(404).json({ error: "Farmer not found" });
    }

    let due = farmer.totalDue - farmer.totalPaid; // Calculate the current due

    if (payGet) {
      farmer.totalPaid += parseFloat(payGet || 0);
      due = farmer.totalDue - farmer.totalPaid; // Update due value

      const action = {
        editedBy: req.user.username,
        date: new Date(),
        debtAmount: parseFloat(payGet || 0),
        due: due, // Add due data
        action: "repayDebt",
      };
      farmer.lastEditedBy.push(action);
    } else if (newDhar) {
      farmer.totalDue += parseFloat(newDhar || 0);
      due = farmer.totalDue - farmer.totalPaid; // Update due value

      const action = {
        editedBy: req.user.username,
        date: new Date(),
        debtAmount: parseFloat(newDhar || 0),
        due: due, // Add due data
        action: "newDebt",
      };
      farmer.lastEditedBy.push(action);
    }

    await farmer.save();
    res.json({
      totalDue: farmer.totalDue,
      totalPaid: farmer.totalPaid,
      editHistory: farmer.lastEditedBy,
    });
  } catch (error) {
    console.error("Error updating farmer:", error);
    res.status(500).json({ error: "Failed to update farmer" });
  }
};
