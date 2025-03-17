import { RequestLog } from "../models/RequestLog.js";

export const requestLogger = async (req, res, next) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    userAgent: req.headers["user-agent"],
  };

  console.log("🛡️ Incoming Request:", logData);
  console.log(`Incoming Request from IP: ${logData.ip}`);

  try {
    await RequestLog.create(logData); // Save log in MongoDB
  } catch (error) {
    console.error("❌ Error saving log:", error);
  }

  next();
};
