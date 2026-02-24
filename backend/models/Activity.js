const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  ngoId: { type: mongoose.Schema.Types.ObjectId, ref: "NGO" },
  title: String,
  description: String,
  category: String,
  location: String,
  date: Date,
  requiredVolunteers: Number
}, { timestamps: true });

module.exports = mongoose.model("Activity", activitySchema);
