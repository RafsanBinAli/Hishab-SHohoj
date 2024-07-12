const mongoose = require("mongoose");

const farmerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  phoneNumber: {
    type: String,
  },
  village: {
    type: String,
  },

  fathersName: {
    type: String,
  },
  totalDue:{
    type: Number,
    default:0,
  }
});

module.exports = mongoose.model("Farmer", farmerSchema);
