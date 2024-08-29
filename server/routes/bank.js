const express = require("express");
const router = express.Router();

const bankController = require("../controllers/bankController");

router.get("/get-all", bankController.showAllBanks);
router.post("/create", bankController.createBank);
router.get("/find-by-name/:bankName", bankController.findBankByName);

module.exports = router;
