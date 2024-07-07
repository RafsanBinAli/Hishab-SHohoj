const Shop = require("../models/shop");
exports.createShop = async (req, res) => {
  try {
    const { shopName, address, phoneNumber, imageUrl } = req.body;
    console.log(req.body);
    const newShop = new Shop({
      shopName,
      address,
      phoneNumber,
      imageUrl,
    });

    const savedShop = await newShop.save();

    res.status(201).json(savedShop);
  } catch (error) {
    console.error("Error creating shop:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.getShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json(shops);
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.updateTotalDue = async (req, res) => {
  try {
    const { shopName, totalDue } = req.body;
    console.log("shopname: ", shopName);
    console.log("totalDue", totalDue);

    // Find the shop by name
    const shop = await Shop.findOne({ shopName });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    // Update the totalDue field
    shop.totalDue += totalDue;

    // Save the updated shop
    const updatedShop = await shop.save();
    console.log(updatedShop);
    res.status(200).json(updatedShop);
  } catch (error) {
    console.error("Error updating totalDue:", error);
    res.status(500).json({ message: "Server error" });
  }
};
