const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: "Activity" },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: "Volunteer" },
  status: { type: String, default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("ActivityRequest", requestSchema);
