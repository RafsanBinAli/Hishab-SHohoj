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

    let due = farmer.totalDue - farmer.totalPaid;

    if (payGet) {
      farmer.totalPaid += parseFloat(payGet || 0);
      due = farmer.totalDue - farmer.totalPaid;

      const action = {
        editedBy: req.user.username,
        date: new Date(),
        debtAmount: parseFloat(payGet || 0),
        due: due,
        action: "repayDebt",
      };
      farmer.lastEditedBy.push(action);
    } else if (newDhar) {
      farmer.totalDue += parseFloat(newDhar || 0);
      console.log(farmer.totalDue)
      due = farmer.totalDue - farmer.totalPaid;

      const action = {
        editedBy: req.user.username,
        date: new Date(),
        debtAmount: parseFloat(newDhar || 0),
        due: due,
        action: "newDebt",
      };
      farmer.lastEditedBy.push(action);
    }
    console.log("Updated farmer data before save:", farmer); 
    await farmer.save();
    res.status(200).json(farmer); // Return the updated farmer object
  } catch (error) {
    console.error("Error updating farmer:", error);
    res.status(500).json({ error: "Failed to update farmer" });
  }
};

exports.updateFarmerById = async (req, res) => {
  const { id } = req.params;
  const { name, village, imageUrl, phoneNumber } = req.body;

  try {
    const farmer = await Farmer.findById(id);

    if (!farmer) {
      return res.status(404).json({ error: `Farmer with ID ${id} not found.` });
    }

    // Update the farmer fields with the new data from the request body
    if (name) farmer.name = name;
    if (village) farmer.village = village;
    if (imageUrl) farmer.imageUrl = imageUrl;
    if (phoneNumber) farmer.phoneNumber = phoneNumber;

    await farmer.save(); // Save the updated farmer details

    res.status(200).json(farmer); // Respond with the updated farmer object
  } catch (error) {
    console.error("Error updating farmer by ID:", error);
    res.status(500).json({ error: "Failed to update farmer by ID" });
  }
};
