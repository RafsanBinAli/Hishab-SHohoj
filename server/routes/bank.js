const express = require("express");
const router = express.Router();

const bankController = require("../controllers/bankController");

router.get("/get-all", bankController.showAllBanks);
router.post("/create", bankController.createBank);
router.get("/find-by-name/:bankName", bankController.findBankByName);
router.put("/update-debt/:bankName", bankController.updateBankDebtByName);

module.exports = router;
