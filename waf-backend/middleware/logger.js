import { RequestLog } from "../models/RequestLog.js";

export const requestLogger = async (req, res, next) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    userAgent: req.headers["user-agent"]
  };

  console.log("🛡️ Incoming Request:", logData);
  console.log(`Incoming Request from IP: ${logData.ip}`);

  // Capture the response status code after the response is sent
  res.on("finish", async () => {
    logData.rescode = res.statusCode;  // ✅ Correct way to capture status code

    try {
      await RequestLog.create(logData);  // Save log in MongoDB
      console.log("✅ Request logged successfully.");
    } catch (error) {
      console.error("❌ Error saving log:", error);
    }
  });

  next();
};
