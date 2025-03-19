import { RequestLog } from "../models/RequestLog.js";

export const requestFilter = (req, res, next) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress,
    userAgent: req.headers["user-agent"]
  };

  console.log("🛡️ Incoming Request:", logData);

  // Override res.send to capture the response message
  const originalSend = res.send;
  res.send = function (body) {
    logData.resMessage = res.statusMessage || "OK";  // ✅ Capture response message
    originalSend.call(this, body);
  };

  res.on("finish", async () => {
    logData.rescode = res.statusCode;

    try {
      await RequestLog.create(logData);  // Save log in MongoDB
      console.log("✅ Request logged successfully.");
    } catch (error) {
      console.error("❌ Error saving log:", error);
    }
  });

  next();
};
