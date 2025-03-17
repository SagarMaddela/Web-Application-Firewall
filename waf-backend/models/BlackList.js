import mongoose from "mongoose";

const blacklistSchema = new mongoose.Schema({
  ip: { type: String, unique: true, required: true },
  reason: { type: String, default: "Malicious activity" },
  createdAt: { type: Date, default: Date.now },
});

export const Blacklist = mongoose.model("Blacklist", blacklistSchema);
