const Slip = require("../models/slip");
exports.findOrCreateSlip = async (req, res) => {
  const { shopName, date } = req.body;

  try {
    let slips = [];

    // Handle multiple shop names in case of array
    if (Array.isArray(shopName)) {
      slips = await Promise.all(
        shopName.map(async (name) => {
          let slip = await Slip.findOne({
            shopName: name,
            createdAt: date,
          });

          if (!slip) {
            slip = new Slip({
              shopName: name,
              createdAt: date,
              purchases: [],
              totalAmount: 0,
            });

            await slip.save();
            console.log("Creating new slip for", name, "on", date);
          }

          return slip;
        })
      );
    } else {
      let slip = await Slip.findOne({
        shopName,
        createdAt: date,
      });

      if (!slip) {
        slip = new Slip({
          shopName,
          createdAt: date,
          purchases: [],
          totalAmount: 0,
        });

        await slip.save();
        console.log("Creating new slip for", shopName, "on", date);
      }

      slips.push(slip);
    }

    res.status(200).json(slips);
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