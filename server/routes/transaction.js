const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");

router.post("/save-daily", transactionController.saveDailyTransaction);
router.get("/get-daily/:date",transactionController.getDailyTransaction)
router.post("/dhar-entry",transactionController.dharEntry)
router.post("/dhar-repay",transactionController.dharRepay)
router.post("/dokan-payment",transactionController.dokanPayment)
router.post("/create-daily",transactionController.createDaily)
module.exports = router;
