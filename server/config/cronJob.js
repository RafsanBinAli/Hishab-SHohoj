const cron = require("node-cron");
const axios = require("axios");

const baseUrl = "http://localhost:4000";

cron.schedule(
  "22 12 * * *",
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
  },
);
