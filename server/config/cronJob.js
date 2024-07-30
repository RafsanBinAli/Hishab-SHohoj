const cron = require("node-cron");
const axios = require("axios");

// Schedule a cron job to run daily at 1 AM
cron.schedule("30 0 * * *", async () => {
  try {
    const response = await axios.post(
      "http://localhost:4000/transaction/create-daily",
      {}
    );
    console.log("Daily transaction created successfully:", response.data);
  } catch (error) {
    console.error("Error calling create-transaction API:", error);
  }
});
