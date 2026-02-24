const VolunteerNotificationDetails = require("../models/VolunteerNotificationDetails");
const Volunteer = require("../models/Volunteer");
const nodemailer = require("nodemailer");
const express = require("express");
const Activity = require("../models/Activity");
const ActivityRequest = require("../models/ActivityRequest");
const Notification = require("../models/Notification");

const router = express.Router();
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

async function sendMail(to, subject, html) {
  await transporter.sendMail({
    from: `"Impact Link" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}



/* Create Activity */
router.post("/create", async (req, res) => {
  const activity = await Activity.create(req.body);
  res.json(activity);
});

/* Get All Activities */
router.get("/", async (req, res) => {
  const activities = await Activity.find();
  res.json(activities);
});

/* Volunteer Request */
router.post("/request", async (req, res) => {
  const request = await ActivityRequest.create({
    activityId: req.body.activityId,
    volunteerId: req.body.volunteerId
  });

  // 🔥 Create Notification for NGO
  const activity = await Activity.findById(req.body.activityId);

  await Notification.create({
    activityId: req.body.activityId,
    volunteerId: req.body.volunteerId,
    ngoId: activity.ngoId,
    type: "request",
    message: "A volunteer requested to join your activity"
  });

  res.json(request);
});


/* Get NGO Requests */
router.get("/requests/:ngoId", async (req, res) => {
  const activities = await Activity.find({ ngoId: req.params.ngoId });
  const activityIds = activities.map(a => a._id);

  const requests = await ActivityRequest.find({
    activityId: { $in: activityIds }
  }).populate("activityId").populate("volunteerId");

  res.json(requests);
});

/* Update Status */
/* ================= UPDATE REQUEST STATUS ================= */
router.put("/update/:id", async (req, res) => {
  try {

    const request = await ActivityRequest.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    const volunteer = await Volunteer.findById(request.volunteerId);
    const activity = await Activity.findById(request.activityId);

    /* ===== ACCEPTED ===== */
    if (req.body.status === "accepted") {

      // 1️⃣ Create Notification
      const notification = await Notification.create({
        activityId: request.activityId,
        volunteerId: request.volunteerId,
        ngoId: null,
        type: "accepted",
        message: `You have been accepted for activity: ${activity.title}`
      });

      // 2️⃣ Create VolunteerNotificationDetails entry
      await VolunteerNotificationDetails.create({
        volunteerId: request.volunteerId,
        notificationId: notification._id
      });

      // 3️⃣ Send Email
     await sendMail(
  volunteer.email,
  "🎉 You Have Been Accepted | Impact Link",
  `
  <div style="font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#f4f6f9;border-radius:12px">
    
    <h2 style="color:#1e40af;">Congratulations ${volunteer.name}! 🎉</h2>

    <p style="font-size:16px;color:#334155;">
      Great news! You have been <strong style="color:#10b981;">ACCEPTED</strong> 
      for the following activity:
    </p>

    <div style="background:white;padding:15px;border-radius:10px;margin:15px 0;border-left:5px solid #10b981;">
      <h3 style="margin:0;color:#0f172a;">${activity.title}</h3>
      <p style="margin:5px 0;color:#475569;">
        📍 Location: ${activity.location}
      </p>
      <p style="margin:5px 0;color:#475569;">
        📅 Date: ${new Date(activity.date).toDateString()}
      </p>
    </div>

    <p style="color:#475569;">
      Thank you for volunteering and making a difference in the community.
    </p>

    <p style="margin-top:20px;font-weight:bold;color:#1e293b;">
      — Team Impact Link
    </p>
  </div>
  `
);

    }

    /* ===== REJECTED ===== */
    if (req.body.status === "rejected") {

      const notification = await Notification.create({
        activityId: request.activityId,
        volunteerId: request.volunteerId,
        ngoId: null,
        type: "rejected",
        message: `Your request for ${activity.title} was rejected.`
      });

      await VolunteerNotificationDetails.create({
        volunteerId: request.volunteerId,
        notificationId: notification._id
      });

      await sendMail(
  volunteer.email,
  "Update on Your Activity Request | Impact Link",
  `
  <div style="font-family:Segoe UI,Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background:#fff7f7;border-radius:12px">
    
    <h2 style="color:#dc2626;">Hello ${volunteer.name},</h2>

    <p style="font-size:16px;color:#334155;">
      Thank you for showing interest in volunteering.
    </p>

    <div style="background:white;padding:15px;border-radius:10px;margin:15px 0;border-left:5px solid #ef4444;">
      <h3 style="margin:0;color:#0f172a;">${activity.title}</h3>
      <p style="margin:5px 0;color:#475569;">
        📍 Location: ${activity.location}
      </p>
      <p style="margin:5px 0;color:#475569;">
        📅 Date: ${new Date(activity.date).toDateString()}
      </p>
    </div>

    <p style="color:#475569;">
      Unfortunately, your request was not accepted this time.
    </p>

    <p style="color:#475569;">
      Please continue exploring other activities — we appreciate your willingness to help!
    </p>

    <p style="margin-top:20px;font-weight:bold;color:#1e293b;">
      — Team Impact Link
    </p>
  </div>
  `
);

    }

    res.json(request);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to update request" });
  }
});

/* ================= GET REQUESTS FOR VOLUNTEER ================= */
router.get("/volunteer-requests/:volunteerId", async (req, res) => {
  try {

    const requests = await ActivityRequest.find({
      volunteerId: req.params.volunteerId
    }).populate("activityId");

    res.json(requests);

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Failed to fetch volunteer requests" });
  }
});


module.exports = router;
