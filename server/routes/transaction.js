const express = require("express");
const router = express.Router();

const transactionController = require("../controllers/transactionController");

router.post("/save", transactionController.saveDailyTransaction);
router.get("/get-daily/:date", transactionController.getDailyTransaction);
router.post("/dhar-entry", transactionController.dharEntry);
router.post("/dhar-repay", transactionController.dharRepay);
router.post("/dokan-payment", transactionController.dokanPayment);
router.post("/create-daily", transactionController.createDaily);
router.post(
  "/update-daily-cash-stack",
  transactionController.updateDailyCashStack
);
router.post("/update-other-cost", transactionController.updateOtherCost);
router.post("/handle-my-own-debt", transactionController.updateMyOwnDebt);
router.get("/calculate", transactionController.calculateCommissionAndKhajna);
router.post("/unpaid-deal-addition", transactionController.addUnpaidDeal);

router.post("/unpaid-deal-subtraction", transactionController.subUnpaidDeal);
module.exports = router;
