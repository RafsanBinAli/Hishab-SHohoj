const cron = require("node-cron");
const axios = require("axios");

// Schedule a cron job to run daily at 1 AM
cron.schedule(
  "22 10 * * *",
  async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/transaction/create-daily"
      );
      console.log("Daily transaction created successfully:", response.data);
    } catch (error) {
      console.error("Error calling create-transaction API:", error.message);
    }
  },
  {
    timezone: "Asia/Dhaka",
  }
);

cron.schedule(
  "59 23 * * *",
  async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/slip/calculation-for-debt"
      );
      console.log("End of day task executed successfully:", response.data);
    } catch (error) {
      console.error("Error calling end-of-day API:", error.message);
    }
  },
  {
    timezone: "Asia/Dhaka",
  }
);
