const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  farmerName: {
    type: String,
    required: true,
  },
  stockName: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  
});

const slipSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    index: true,
    get: function(date) {
        return date.toISOString().split('T')[0]; // Return YYYY-MM-DD format
    },
    set: function(dateString) {
        const date = new Date(dateString); // Parse date string into Date object
        date.setUTCHours(0, 0, 0, 0); // Set time to 00:00 UTC
        return date;
    }
},
  purchases: {
    type: [purchaseSchema],
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  paidAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  dueAmount: {
    type: Number,
    get: function() {
      return this.totalAmount - this.paid;
    },
    set: function(value) {
      // Optionally handle setting due if needed
      // This getter is primarily for read-only purposes
      return value;
    }
  },
  isEdited: {
    type: Boolean,
    default: false,
  }
});

module.exports = mongoose.model("Slip", slipSchema);
