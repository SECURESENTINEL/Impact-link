const mongoose = require("mongoose");

const volunteerNotificationSchema = new mongoose.Schema({
  volunteerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Volunteer",
    required: true
  },
  notificationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Notification",
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

module.exports = mongoose.model(
  "VolunteerNotificationDetails",
  volunteerNotificationSchema
);
