const Farmer = require("../models/Farmer");
const NewDeal = require("../models/NewDeal");
const { startOfDay, endOfDay } = require("date-fns");
const logger = require("../utils/logger"); // Added logger import

exports.createDeal = async (req, res) => {
  try {
    
    const userName = req.body.name;
    const farmer = await Farmer.findOne({ name: userName });

    if (!farmer) {
      logger.warn(`POST /createDeal - Farmer not found: ${userName}`);
      return res.status(204).json({ message: "Farmer not found" });
    }

    const newDeal = new NewDeal({
      farmerId: farmer._id,
      farmerName: userName,
    });

    await newDeal.save();
    
    logger.info(`POST /createDeal - Success - Deal ID: ${newDeal._id}`);
    res.status(201).json(newDeal);
  } catch (err) {
    logger.error(`POST /createDeal - Error: ${err.message}`, { stack: err.stack });
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getAllMarketDeals = async (req, res) => {
  try {
    const { date } = req.query;

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

exports.getAllMarketDealsOfToday = async (req, res) => {
  try {
    const date = new Date();
    let filter = {};
    if (date) {
      const startDate = startOfDay(new Date(date));
      const endDate = endOfDay(new Date(date));
      filter.createdAt = { $gte: startDate, $lte: endDate };
    }

    const deals = await NewDeal.find(filter);
    res.status(200).json(deals);
  } catch (error) {
    console.error("Error fetching market deals", error);
    res.status(500).json({ message: "Server Error!" });
  }
};

exports.getCardDetailsById = async (req, res) => {
  const { id } = req.params;

  try {
    const card = await NewDeal.findById(id);

    if (!card) {
      return res.status(204).json({ message: "Card not found" });
    }

    res.status(200).json(card);
  } catch (error) {
    console.error("Error fetching card details:", error);
    res.status(500).json({ message: "Failed to fetch card details" });
  }
};

exports.updateDealPurchases = async (req, res) => {
  try {
    const { id } = req.params;
    const { purchases } = req.body;
    
    if (!Array.isArray(purchases)) {
      logger.warn(`PUT /updateDealPurchases/${id} - Invalid request data: purchases is not an array`);
      return res.status(400).json({ message: "Invalid request data" });
    }
    
    // First, get the current document to access existing purchases
    const currentDeal = await NewDeal.findById(id);
    
    if (!currentDeal) {
      logger.warn(`PUT /updateDealPurchases/${id} - NewDeal not found`);
      return res.status(204).json({ message: "NewDeal not found" });
    }
    
    // Add new purchases
    const updatedDeal = await NewDeal.findByIdAndUpdate(
      id,
      { $push: { purchases: { $each: purchases } } },
      { new: true }
    );
    
    // Calculate new totals
    let purchasesTotal = 0;
    if (updatedDeal.purchases && updatedDeal.purchases.length > 0) {
      purchasesTotal = updatedDeal.purchases.reduce((sum, purchase) => {
        return sum + (purchase.price * purchase.quantity);
      }, 0);
    }
    
    // Update the totals fields
    updatedDeal.totalPurchasesAmount = purchasesTotal;
    updatedDeal.totalAmountToBeGiven = purchasesTotal - (updatedDeal.khajna || 0) - (updatedDeal.commission || 0);
    
    // Save to persist the calculated values
    await updatedDeal.save();
    
    logger.info(`PUT /updateDealPurchases/${id} - Success - Deal ID: ${updatedDeal._id}`);
    res.status(200).json(updatedDeal);
  } catch (error) {
    logger.error(`PUT /updateDealPurchases/${req.params.id} - Error: ${error.message}`, { stack: error.stack });
    console.error("Error updating NewDeal:", error);
    res.status(500).json({ message: "Failed to update NewDeal" });
  }
};

// Example of ensuring the full document is returned
exports.updateCardDetails = async (req, res) => {
  try {
    
    const { khajna, commission, totalAmountToBeGiven, id } = req.body;
    const cardDetails = await NewDeal.findById(id);

    if (!cardDetails) {
      logger.warn(`PUT /updateCardDetails - Card details not found with ID: ${id}`);
      return res.status(204).json({ message: "Card details not found!" });
    }

    cardDetails.khajna = khajna;
    cardDetails.commission = commission;
    cardDetails.totalAmountToBeGiven = totalAmountToBeGiven;
    cardDetails.doneStatus = true;
    await cardDetails.save();

    logger.info(`PUT /updateCardDetails - Success - Card ID: ${cardDetails._id}`);
    res.json({
      message: "Card details updated successfully!",
      cardDetails: cardDetails,
    });
  } catch (error) {
    logger.error(`PUT /updateCardDetails - Error: ${error.message}`, { stack: error.stack });
    console.error("Error updating card details:", error);
    res.status(500).json({ message: "Error updating card details", error });
  }
};

exports.getIncompleteMarketDeals = async (req, res) => {
  try {
    const filter = { doneStatus: false };
    const deals = await NewDeal.find(filter);
    res.status(200).json(deals);
  } catch (error) {
    console.error("Error fetching incomplete market deals:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getDealsOfParticularDay = async (req, res) => {
  const { date } = req.query;
  if (!date) {
    return res.status(400).json({ error: "Date query parameter is required" });
  }

  try {
    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    const deals = await NewDeal.find({
      createdAt: {
        $gte: new Date(dateObj.setHours(0, 0, 0, 0)),
        $lt: new Date(dateObj.setHours(23, 59, 59, 999)),
      },
    });

    res.json(deals);
  } catch (error) {
    console.error("Error fetching deals:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};