require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const NGO = require("../models/NGO");
const Volunteer = require("../models/Volunteer");

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendMail(to, subject, html) {
  await transporter.sendMail({
    from: `"Impact Link" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
}

/* NGO Signup */
router.post("/ngo/signup", async (req, res) => {
  try {
    const { ngoName, headName, establishmentDate, email, username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const ngo = await NGO.create({
      ngoName,
      headName,
      establishmentDate,
      email,
      username,
      password: hashed
    });

    await sendMail(
  email,
  "NGO Registration Successful",
  `
  <div style="font-family: Arial, sans-serif; background:#f4f6f9; padding:30px;">
    <div style="max-width:600px; margin:auto; background:white; border-radius:12px; padding:30px; box-shadow:0 10px 30px rgba(0,0,0,0.1);">

      <h2 style="color:#1e293b; margin-bottom:10px;">
        🎉 Welcome to Impact Link!
      </h2>

      <p style="color:#475569; font-size:15px;">
        Your NGO account has been successfully created.
      </p>

      <div style="margin:20px 0; padding:15px; background:#e0f2fe; border-left:4px solid #1e40af; border-radius:6px;">
        <strong>What you can do now:</strong>
        <ul style="margin-top:10px; color:#334155;">
          <li>Create and manage activities</li>
          <li>Review volunteer requests</li>
          <li>Send notifications to volunteers</li>
        </ul>
      </div>

      <p style="color:#475569;">
        Start creating impact today 🚀
      </p>

      <div style="margin-top:30px; text-align:center;">
        <a href="http://localhost:8000/ngo-login.html"
           style="background:#1e40af; color:white; padding:12px 20px; border-radius:8px; text-decoration:none; font-weight:600;">
           Login to Dashboard
        </a>
      </div>

      <hr style="margin:30px 0; border:none; border-top:1px solid #e2e8f0;">

      <p style="font-size:12px; color:#94a3b8; text-align:center;">
        Impact Link — Connecting NGOs and Volunteers
      </p>

    </div>
  </div>
  `
);


    res.status(201).json({
      message: "NGO registered successfully",
      role: "ngo",
      ngoId: ngo._id
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email or Username already exists" });
    }
    res.status(400).json({ error: err.message });
  }
});



/* Volunteer Signup */
router.post("/volunteer/signup", async (req, res) => {
  try {
    const { name, age, email, username, password } = req.body;

    const hashed = await bcrypt.hash(password, 10);

    const volunteer = await Volunteer.create({
      name,
      age,
      email,
      username,
      password: hashed
    });

    await sendMail(
  email,
  "Welcome to Impact Link 🎉",
  `
  <div style="font-family:Segoe UI, sans-serif; background:#f4f6f9; padding:30px;">
    
    <div style="max-width:600px; margin:auto; background:white; border-radius:12px; overflow:hidden; box-shadow:0 10px 30px rgba(0,0,0,0.1);">
      
      <div style="background:linear-gradient(135deg,#f97316,#ea580c); padding:20px; text-align:center;">
        <h1 style="color:white; margin:0;">Impact Link</h1>
        <p style="color:white; margin:5px 0 0;">Volunteer Registration Successful</p>
      </div>

      <div style="padding:30px;">
        <h2 style="color:#1f2937;">Welcome, ${name} 👋</h2>

        <p style="color:#475569; line-height:1.6;">
          Your volunteer account has been successfully created.
          You can now browse activities and start making an impact!
        </p>

        <div style="margin:25px 0;">
          <a href="http://localhost:8000/volunteer-login.html"
             style="background:#f97316; color:white; padding:12px 20px; 
             text-decoration:none; border-radius:8px; font-weight:600;">
             Login to Your Dashboard
          </a>
        </div>

        <p style="color:#64748b; font-size:13px;">
          Thank you for choosing to serve communities with Impact Link.
        </p>
      </div>

      <div style="background:#f1f5f9; text-align:center; padding:15px; font-size:12px; color:#64748b;">
        © 2026 Impact Link | Connecting People with Purpose
      </div>

    </div>
  </div>
  `
);


    res.status(201).json({
      message: "Volunteer registered successfully",
      role: "volunteer",
      volunteerId: volunteer._id
    });

  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: "Email or Username already exists" });
    }
    res.status(400).json({ error: err.message });
  }
});


/* NGO Login */
router.post("/ngo/login", async (req, res) => {
  const { username, password } = req.body;

  const ngo = await NGO.findOne({ username });
  if (!ngo) return res.status(404).json({ error: "NGO not found" });

  const ok = await bcrypt.compare(password, ngo.password);
  if (!ok) return res.status(401).json({ error: "Wrong password" });

  res.json({ message: "Login success",
    role: "ngo",
    ngoId: ngo._id
   });
});

/* Volunteer Login */
router.post("/volunteer/login", async (req, res) => {
  try {

    const { username, password } = req.body;

    const volunteer = await Volunteer.findOne({ username });

    if (!volunteer) {
      return res.status(404).json({ error: "Volunteer not found" });
    }

    const isMatch = await require("bcryptjs").compare(password, volunteer.password);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      role: "volunteer",
      volunteerId: volunteer._id
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});


module.exports = router;
