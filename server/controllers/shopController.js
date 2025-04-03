const Shop = require("../models/shop");
const logger = require("../utils/logger");

// Function to get the current normalized date (consistent with other controllers)
function getCurrentNormalizedDate() {
  const now = new Date();
  // Get Bangladesh date components (since you're using Asia/Dhaka timezone)
  const options = { timeZone: 'Asia/Dhaka' };
  const bdTime = new Intl.DateTimeFormat('en-US', options).format(now);
  const [month, day, year] = bdTime.split('/').map(Number);
  
  // Create a UTC date that corresponds to this date in Bangladesh
  return new Date(Date.UTC(year, month-1, day));
}

// Create a new shop
exports.createShop = async (req, res) => {
  try {
    logger.info(`POST /createShop - Request: ${JSON.stringify(req.body)}`);
    
    const { shopName, address, phoneNumber, imageUrl } = req.body;
    const existingShop = await Shop.findOne({ shopName });
    
    if (existingShop) {
      logger.warn(`POST /createShop - Shop already exists: ${shopName}`);
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
    
    logger.info(`POST /createShop - Success - Shop ID: ${savedShop._id}`);
    res.status(201).json(savedShop);
  } catch (error) {
    logger.error(`POST /createShop - Error: ${error.message}`, { stack: error.stack });
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
    logger.error(`GET /getShops - Error: ${error.message}`, { stack: error.stack });
    console.error("Error fetching shops:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update total due of a shop
exports.updateTotalDue = async (req, res) => {
  try {
    logger.info(`PUT /updateTotalDue - Request: ${JSON.stringify(req.body)}`);
    
    const { shopName, paidAmount } = req.body;
    const shop = await Shop.findOne({ shopName });
    
    if (!shop) {
      logger.warn(`PUT /updateTotalDue - Shop not found: ${shopName}`);
      return res.status(204).json({ message: "Shop not found" });
    }
    
    shop.totalDue -= paidAmount;
    const updatedShop = await shop.save();
    
    logger.info(`PUT /updateTotalDue - Success - Shop ID: ${updatedShop._id}`);
    res.status(200).json(updatedShop);
  } catch (error) {
    logger.error(`PUT /updateTotalDue - Error: ${error.message}`, { stack: error.stack });
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
      return res.status(204).json({ message: "Shop not found by this name" });
    }
    
    res.status(200).json(shop);
  } catch (error) {
    logger.error(`GET /getShopDetailsByName/${req.params.shopName} - Error: ${error.message}`, { stack: error.stack });
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
      return res.status(204).json({ message: "Shop not found" });
    }
    
    res.status(200).json(shop);
  } catch (error) {
    logger.error(`GET /getShopDetailsById/${req.params.id} - Error: ${error.message}`, { stack: error.stack });
    console.error("Error fetching shop by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Update shop details by ID
exports.updateShopById = async (req, res) => {
  try {
    logger.info(`PUT /updateShopById/${req.params.id} - Request: ${JSON.stringify(req.body)}`);
    
    const { id } = req.params;
    const { shopName, address, phoneNumber, imageUrl } = req.body;
    
    const updatedShop = await Shop.findByIdAndUpdate(
      id,
      { shopName, address, phoneNumber, imageUrl },
      { new: true }
    );
    
    if (!updatedShop) {
      logger.warn(`PUT /updateShopById/${id} - Shop not found`);
      return res.status(204).json({ message: "Shop not found" });
    }
    
    logger.info(`PUT /updateShopById/${id} - Success - Shop ID: ${updatedShop._id}`);
    res.status(200).json(updatedShop);
  } catch (error) {
    logger.error(`PUT /updateShopById/${req.params.id} - Error: ${error.message}`, { stack: error.stack });
    console.error("Error updating shop:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};