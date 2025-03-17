import { Blacklist } from "../models/BlackList.js";

export const requestFilter = async (req, res, next) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];
  const blockedUserAgents = ["BadBot", "MaliciousScraper"];

  // Check if the IP is blacklisted
  const blacklistedIP = await Blacklist.findOne({ ip });
  if (blacklistedIP) {
    return res.status(403).json({ message: "🚫 Access denied: Blacklisted IP" });
  }

  // Block requests from known bad user-agents
  if (blockedUserAgents.some((agent) => userAgent.includes(agent))) {
    return res.status(403).json({ message: "🚫 Access denied: Suspicious user-agent" });
  }

  next(); // Allow request if not blocked
};
