const Shop = require("../models/shop");

// Create a new shop
exports.createShop = async (req, res) => {
  try {
    const { shopName, address, phoneNumber, imageUrl } = req.body;

    const existingShop = await Shop.findOne({ shopName });
    if (existingShop) {
      return res
        .status(400)
        .json({ message: "Shop with this name already exists" });
    }

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

// Get all shops
exports.getShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json(shops);
  } catch (error) {
    console.error("Error fetching shops:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update total due of a shop
exports.updateTotalDue = async (req, res) => {
  try {
    const { shopName, paidAmount } = req.body;
    const shop = await Shop.findOne({ shopName });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.totalDue -= paidAmount;
    const updatedShop = await shop.save();
    res.status(200).json(updatedShop);
  } catch (error) {
    console.error("Error updating totalDue:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get shop details by name
exports.getShopDetailsByName = async (req, res) => {
  try {
    const { shopName } = req.params;
    const shop = await Shop.findOne({ shopName });

    if (!shop) {
      return res.status(404).json({ message: "Shop not found by this name" });
    }

    res.status(200).json(shop);
  } catch (error) {
    console.error("Error fetching data of shop:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get shop details by ID
exports.getShopDetailsById = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findById(id);

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json(shop);
  } catch (error) {
    console.error("Error fetching shop by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update shop details by ID
exports.updateShopById = async (req, res) => {
  const { id } = req.params;
  const { shopName, address, phoneNumber, imageUrl } = req.body;
  try {
    const updatedShop = await Shop.findByIdAndUpdate(
      req.params.id,
      { shopName, address, phoneNumber, imageUrl },
      { new: true }
    );

    if (!updatedShop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    res.status(200).json(updatedShop);
  } catch (error) {
    console.error("Error updating shop:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
