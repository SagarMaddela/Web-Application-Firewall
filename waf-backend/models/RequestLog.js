import mongoose from "mongoose";

const requestLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  method: String,
  url: String,
  ip: String,
  userAgent: String,
});

export const RequestLog = mongoose.model("RequestLog", requestLogSchema);
