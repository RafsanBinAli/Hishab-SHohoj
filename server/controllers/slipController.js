const Slip = require("../models/slip");
const Shop = require("../models/shop");
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
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
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
  const { slipId, paidAmount } = req.body;
  try {
    let slip = await Slip.findById(slipId);
    if (!slip) {
      return res.status(404).json({ message: "Slip not found" });
    }

    slip.paidAmount += paidAmount;
    await slip.save();
    res.status(200).json({ message: "Slip updated successfully", slip });
  } catch (error) {
    console.error("Error updating slip's paidAmount:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateShopDueForToday = async (req, res) => {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const startOfDay = new Date(Date.UTC(year, month - 1, day, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999));

  try {
    const slips = await Slip.find({
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    });

    if (!slips || slips.length === 0) {
      return res.status(404).json({ message: "No slips found for today" });
    }

    const updatePromises = slips.map(async (slip) => {
      if (slip.totalAmount !== slip.paidAmount) {
        const remainingDue = slip.totalAmount - slip.paidAmount;

        try {
          const shop = await Shop.findOne({ shopName: slip.shopName });
          if (!shop) {
            console.error(`Shop not found for slip with ID ${slip._id}`);
            return; // Skip updating this shop if not found
          }
          console.log("total DUe before", shop.totalDue);
          shop.totalDue += remainingDue;
          console.log("total due after : ", shop.totalDue);

          await shop.save();
        } catch (error) {
          console.error(`Error updating shop ${slip.shopName}:`, error);
        }
      }
    });

    await Promise.all(updatePromises);

    res
      .status(200)
      .json({ message: "Shops' due amounts updated successfully" });
  } catch (error) {
    console.error("Error updating shops' due amounts:", error);
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error" });
    }
  }
};
