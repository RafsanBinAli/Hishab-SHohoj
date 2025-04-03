const DebtHistory = require("../models/DebtHistory");
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

exports.getAllDebtEntries = async (req, res) => {
  try {
    const debtEntries = await DebtHistory.find({});
    res.status(200).json(debtEntries);
  } catch (error) {
    logger.error(`GET /getAllDebtEntries - Error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      message: "Failed to fetch debt history records!",
      error: error.message,
    });
  }
};

exports.createDebtEntry = async (req, res) => {
  try {
    logger.info(`POST /createDebtEntry - Request: ${JSON.stringify(req.body)}`);
    
    // Use current normalized date if date is not provided
    const { amount, type } = req.body;
    let { date } = req.body;
    
    if (!date) {
      date = getCurrentNormalizedDate();
      logger.info(`Using current normalized date: ${date}`);
    } else {
      // Normalize the provided date
      const providedDate = new Date(date);
      date = new Date(
        Date.UTC(
          providedDate.getFullYear(),
          providedDate.getMonth(),
          providedDate.getDate()
        )
      );
      logger.info(`Using provided normalized date: ${date}`);
    }
    
    const newDebtEntry = new DebtHistory({
      date,
      amount,
      type,
    });
    
    await newDebtEntry.save();
    
    logger.info(`POST /createDebtEntry - Success - DebtEntry ID: ${newDebtEntry._id}`);
    res.status(201).json({
      message: "Debt entry created successfully!",
      debtEntry: newDebtEntry,
    });
  } catch (error) {
    logger.error(`POST /createDebtEntry - Error: ${error.message}`, { stack: error.stack });
    res.status(500).json({
      message: "Failed to create debt entry!",
      error: error.message,
    });
  }
};