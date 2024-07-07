const Farmer = require("../models/Farmer");

exports.createFarmer = async (req, res) => {
  console.log(req.body);
  const { name, village, fathersName ,phoneNumber } = req.body;

  try {
    // Check if a farmer with the same name already exists
    const existingFarmer = await Farmer.findOne({ name });

    if (existingFarmer) {
      return res
        .status(400)
        .json({ error: "Farmer with this name already exists." });
    }

    // Create a new farmer instance
    const newFarmer = new Farmer({ name, village, fathersName,phoneNumber });

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
