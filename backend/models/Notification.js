const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity"
  },
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Volunteer"
  },
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "NGO"
  },
  type: {
    type: String,
    enum: ["request", "accepted", "rejected"],
    required: true
  },
  message: String,
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
