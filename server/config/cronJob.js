const cron = require("node-cron");
const axios = require("axios");

const baseUrl = process.env.BASE_URL || 'http://localhost:4000';

cron.schedule(
  '10 12 * * *',
  async () => {
    try {
      const response = await axios.post(`${baseUrl}/transaction/create-daily`);
      console.log('Daily transaction created successfully:', response.data);
    } catch (error) {
      console.error('Error calling create-transaction API:', error.message);
    }
  },
  {
    timezone: 'Asia/Dhaka',
  }
);
