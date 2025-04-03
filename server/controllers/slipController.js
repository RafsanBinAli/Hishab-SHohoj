const Slip = require("../models/slip");
const Shop = require("../models/shop");
const mongoose = require("mongoose");
const logger = require("../utils/logger"); // Added logger import

exports.findOrCreateSlip = async (req, res) => {
  try {
    
    const { shopName } = req.body;

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // For display only
    const day = String(currentDate.getDate()).padStart(2, "0");
    
    // Fixed: Using currentDate.getMonth() directly without subtraction
    const startOfDay = new Date(Date.UTC(year, currentDate.getMonth(), day, 0, 0, 0));
    const endOfDay = new Date(Date.UTC(year, currentDate.getMonth(), day, 23, 59, 59, 999));

    let slip = await Slip.findOneAndUpdate(
      {
        shopName,
        createdAt: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
      {
        $setOnInsert: {
          shopName,
          createdAt: startOfDay,
          purchases: [],
          totalAmount: 0,
          paidAmount: 0,
          isEdited: false,
        },
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    logger.info(`POST /findOrCreateSlip - Success - Slip ID: ${slip._id}`);
    res.status(200).json(slip);
  } catch (error) {
    logger.error(`POST /findOrCreateSlip - Error: ${error.message}`, { stack: error.stack });
    console.error("Error finding or creating slip:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSlip = async (req, res) => {
  try {
    
    const slipId = req.params.id;
    const { purchases, shopName, totalAmount } = req.body;

    // Start a transaction to ensure both updates are successful or neither
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Find and update the shop's total due
      let shop = await Shop.findOne({ shopName: shopName }).session(session);
      if (!shop) {
        await session.abortTransaction(); // Abort transaction if shop not found
        session.endSession();
        logger.warn(`PUT /updateSlip/${slipId} - Shop not found: ${shopName}`);
        return res.status(204).json({ message: "Shop not found to update" });
      }
      shop.totalDue += totalAmount;
      await shop.save({ session });

      // Find and update the slip with new purchases
      let slip = await Slip.findById(slipId).session(session);
      if (!slip) {
        await session.abortTransaction(); // Abort transaction if slip not found
        session.endSession();
        logger.warn(`PUT /updateSlip/${slipId} - Slip not found with ID: ${slipId}`);
        return res.status(204).json({ message: "Slip not found" });
      }

      purchases.forEach((purchase) => {
        slip.purchases.push({
          farmerName: purchase.farmerName,
          stockName: purchase.stockName,
          quantity: purchase.quantity,
          price: purchase.price,
          totalPrice: purchase.quantity * purchase.price,
        });
        slip.totalAmount += purchase.quantity * purchase.price;
      });

      await slip.save({ session });
      await session.commitTransaction();
      session.endSession();

      logger.info(`PUT /updateSlip/${slipId} - Success - Slip ID: ${slip._id}, Shop ID: ${shop._id}`);
      res
        .status(200)
        .json({ message: "Slip and shop updated successfully", slip });
    } catch (error) {
      // If any error occurs, abort the transaction
      await session.abortTransaction();
      session.endSession();
      throw error; // Re-throw to be caught by the outer catch block
    }
  } catch (error) {
    logger.error(`PUT /updateSlip/${req.params.id} - Error: ${error.message}`, { stack: error.stack });
    console.error("Error updating slip:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

exports.getSlipDetails = async (req, res) => {
  try {
    const { formattedDate } = req.params;
    const { shopName } = req.query;

    const slipDetail = await Slip.findOne({
      shopName,
      createdAt: formattedDate,
    });

    if (!slipDetail) {
      return res.status(204).json({ error: "Slip details not found" });
    }

    res.json(slipDetail);
  } catch (error) {
    console.error("Error fetching slip details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.findSlipByDate = async (req, res) => {
  const { date } = req.params;
  try {
    const slips = await Slip.find({
      createdAt: date,
    });

    if (!slips || slips.length === 0) {
      return res
        .status(404)
        .json({ message: "No slips found for the given date" });
    }

    res.status(200).json(slips);
  } catch (error) {
    console.error("Error finding slip:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSlipPaidAmount = async (req, res) => {
  try {
    
    const { slipId, paidAmount } = req.body;
    let slip = await Slip.findById(slipId);
    if (!slip) {
      logger.warn(`PUT /updateSlipPaidAmount - Slip not found with ID: ${slipId}`);
      return res.status(204).json({ message: "Slip not found" });
    }

    slip.paidAmount += paidAmount;
    await slip.save();
    
    logger.info(`PUT /updateSlipPaidAmount - Success - Slip ID: ${slip._id}`);
    res.status(200).json({ message: "Slip updated successfully", slip });
  } catch (error) {
    logger.error(`PUT /updateSlipPaidAmount - Error: ${error.message}`, { stack: error.stack });
    console.error("Error updating slip's paidAmount:", error);
    res.status(500).json({ message: "Server error" });
  }
};