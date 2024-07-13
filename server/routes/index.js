const express = require("express");
const router = express.Router();
const farmerController = require("../controllers/farmerController");
const newDealController = require("../controllers/newDealController");
const shopController=require("../controllers/shopController");
const slipController=require("../controllers/slipController")



router.post("/create-farmer", farmerController.createFarmer);
router.get("/get-farmer/:name", farmerController.findFarmerByName);
router.get("/get-all-farmers", farmerController.showAllFarmers);
router.put("/update-farmers/:name", farmerController.updateFarmer);

// Route to create a new deal (assuming it references framer)
router.post("/create-deal", newDealController.createDeal);
router.get("/get-market-deals", newDealController.getAllMarketDeals);
router.get("/get-card-details/:id", newDealController.getCardDetailsById);
router.put("/update-card-details/:id", newDealController.updateDealPurchases);


router.post('/create-shop', shopController.createShop);
router.get('/get-all-shops',shopController.getShops);
router.put('/shop/update-totalDue', shopController.updateTotalDue);


router.post("/slip/findOrCreate", slipController.findOrCreateSlip);

// Route to update or add purchases to a slip for a shop on a specific date
router.put("/slip/update/:id", slipController.updateSlip);
router.get('/slip-details/:formattedDate', slipController.getSlipDetails);
router.get('/slip/:date', slipController.findSlipByDate); 
router.put('/slip/update-editStatus-paid',slipController.updateSlipPaidAmount)
module.exports = router;
