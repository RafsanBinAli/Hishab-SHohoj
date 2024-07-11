const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  fullName: {
    type: String,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  village: {
    type: String,
  },

  role: {
    type: String,
    enum: ["admin", "member"],
    default: "member",
  },
});

module.exports = mongoose.model("Member", memberSchema);
