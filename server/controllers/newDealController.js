const Farmer = require("../models/Farmer"); // Import your User model
const NewDeal = require("../models/NewDeal");
const { startOfDay, endOfDay } = require('date-fns');

exports.createDeal = async (req, res) => {
  try {
    console.log(req.body);
  
    const userName = req.body.name;

    // Find the user by userName to get userId
    const farmer = await Farmer.findOne({ name: userName });

    if (!farmer) {
      return res.status(404).json({ message: "Farmer not found" });
    }

    // Map stocks array to create an array of stock objects for the new deal
    // const stocksArray = stockItems.map((stock) => ({
    //   stockName: stock.stockName,
    //   quantity: stock.quantity,
    //   price: stock.price,
    // }));

    const newDeal = new NewDeal({
      farmerId: farmer._id, // Assuming farmerId is the reference to the Farmer model
      farmerName: userName,
      // stock: stocksArray,
    });

    await newDeal.save();
    res.status(201).json(newDeal);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllMarketDeals = async (req, res) => {
  try {
    const { date } = req.query;

    // Check if a date parameter is provided
    let filter = {};
    if (date) {
      const startDate = startOfDay(new Date(date));
      const endDate = endOfDay(new Date(date));
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }

    const deals = await NewDeal.find(filter);
    res.status(200).json(deals);
  } catch (error) {
    console.error("Error fetching market deals:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getCardDetailsById = async (req, res) => {
  const { id } = req.params;

  try {
    const card = await NewDeal.findById(id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json(card);
  } catch (error) {
    console.error("Error fetching card details:", error);
    res.status(500).json({ message: "Failed to fetch card details" });
  }
};

exports.updateDealPurchases = async (req, res) => {
  const { id } = req.params;
  const { purchases } = req.body;
  console.log(purchases)

  if (!Array.isArray(purchases)) {
    return res.status(400).json({ message: "Invalid request data" });
  }

  try {
    const updatedDeal = await NewDeal.findByIdAndUpdate(
      id,
      { $push: { purchases: { $each: purchases } } },
      { new: true }
    );

    if (!updatedDeal) {
      return res.status(404).json({ message: "NewDeal not found" });
    }

    res.status(200).json(updatedDeal);
  } catch (error) {
    console.error("Error updating NewDeal:", error);
    res.status(500).json({ message: "Failed to update NewDeal" });
  }
};
