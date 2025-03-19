import mongoose from "mongoose";

const requestLogSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  method: { type: String, required: true },
  url: { type: String, required: true },
  ip: { type: String, required: true },
  userAgent: { type: String, required: true },
  rescode: { type: Number, required: true },  // ✅ Response code
  resMessage: { type: String }  // ✅ Response message
});

export const RequestLog = mongoose.model("RequestLog", requestLogSchema);
