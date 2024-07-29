const Slip = require("../models/slip");

exports.findSlip = async (shopname) => {
  try {
    const slip = await Slip.findOne({
      shopName: shopname,
    });

    return slip;
  } catch (error) {
    console.error("Error finding slip:", error);
    throw error;
  }
};

exports.createSlip = async (shopName, startOfDay) => {
  try {
    const slip = new Slip({
      shopName,
      createdAt: startOfDay,
      purchases: [],
      totalAmount: 0,
    });

    await slip.save();
    console.log("Created new slip:", slip._id);

    return slip;
  } catch (error) {
    console.error("Error creating slip:", error);
    throw error;
  }
};
