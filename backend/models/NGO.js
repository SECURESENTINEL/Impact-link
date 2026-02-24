const mongoose = require("mongoose");

const ngoSchema = new mongoose.Schema({
  ngoName: { type: String, required: true },
  headName: { type: String, required: true },
  establishmentDate: { type: Date, required: true },
  email: { type: String, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("NGO", ngoSchema);
