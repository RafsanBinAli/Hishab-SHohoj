const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");

router.post("/save-daily", transactionController.saveDailyTransaction);
router.get("/get-daily",transactionController.getDailyTransaction)
router.post("/dhar-entry",transactionController.dharEntry)
router.post("/dhar-repay",transactionController.dharRepay)
router.post("/dokan-payment",transactionController.dokanPayment)
module.exports = router;
