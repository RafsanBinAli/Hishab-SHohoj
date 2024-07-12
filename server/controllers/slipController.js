const Slip = require("../models/slip");

const { findSlip, createSlip } = require("../services/slipService");

exports.findOrCreateSlip = async (req, res) => {
  const { shopName } = req.body;

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

  try {
    console.log("shopName is", shopName);
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
        new: true, // Return the updated document if found or created
        upsert: true, // Create a new document if not found
        setDefaultsOnInsert: true, // Ensure defaults are set when inserting a new document
      }
    );

    res.status(200).json(slip);
  } catch (error) {
    console.error("Error finding or creating slip:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateSlip = async (req, res) => {
  const slipId = req.params.id;
  const { purchases } = req.body;

  try {
    let slip = await Slip.findById(slipId);

    if (!slip) {
      return res.status(404).json({ message: "Slip not found" });
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

    await slip.save();
    res.status(200).json(slip);
  } catch (error) {
    console.error("Error updating slip:", error);
    res.status(500).json({ message: "Server error" });
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
      return res.status(404).json({ error: "Slip details not found" });
    }

    res.json(slipDetail);
  } catch (error) {
    console.error("Error fetching slip details:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.findSlipByDate = async (req, res) => {
  const { date } = req.params; // Assuming date is provided in ISO format (e.g., "2024-07-07T00:00:00.000Z")
  console.log(date);
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
  const { slipId, paidAmount, edit } = req.body;

  try {
    // Find the slip by _id
    let slip = await Slip.findById(slipId);

    if (!slip) {
      return res.status(404).json({ message: "Slip not found" });
    }

    // Update paidAmount
    slip.paidAmount = paidAmount;

    // Update isEdited based on edit flag (if needed)
    if (edit) {
      slip.isEdited = true;
    }

    // Save the updated slip
    await slip.save();

    res.status(200).json({ message: "Slip updated successfully", slip });
  } catch (error) {
    console.error("Error updating slip's paidAmount:", error);
    res.status(500).json({ message: "Server error" });
  }
};
