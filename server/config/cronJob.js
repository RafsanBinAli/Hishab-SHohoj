const cron = require("node-cron");
const axios = require("axios");
const baseUrl = process.env.BACKEND_URL;

cron.schedule(
  "5 1 * * *",  // This means: At 4:05 AM every day
  async () => {
    try {
      const response = await axios.post(`${baseUrl}/transaction/create-daily`);
      console.log("Daily transaction created successfully:", response.data);
    } catch (error) {
      console.error("Error calling create-transaction API:", error.message);
    }
  },
  {
    timezone: "Asia/Dhaka",
  }
);