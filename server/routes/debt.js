const express = require("express");
const router = express.Router();

const debtController = require("../controllers/debtController");

router.get("/get-own-debt", debtController.getAllDebtEntries);


module.exports = router;
