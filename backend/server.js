require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const activityRoutes = require("./routes/activityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));;

app.use("/api/auth", authRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/notifications", notificationRoutes);

app.listen(5000, () => console.log("Server running on 5000"));
