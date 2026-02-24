const express = require("express");
const Notification = require("../models/Notification");
const VolunteerNotificationDetails = require("../models/VolunteerNotificationDetails");

const router = express.Router();

/* ================= NGO NOTIFICATIONS ================= */
router.get("/ngo/:ngoId", async (req, res) => {
  try {
    const notifications = await Notification.find({
      ngoId: req.params.ngoId
    }).populate("activityId").populate("volunteerId");

    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch NGO notifications" });
  }
});

/* ================= VOLUNTEER NOTIFICATIONS ================= */
router.get("/volunteer/:volunteerId", async (req, res) => {
  try {

    const records = await VolunteerNotificationDetails.find({
      volunteerId: req.params.volunteerId
    }).populate({
      path: "notificationId",
      populate: { path: "activityId" }
    });

    res.json(records);

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Volunteer notifications" });
  }
});

module.exports = router;
