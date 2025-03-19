import { Blacklist } from "../models/BlackList.js";
import { BlockedUserAgent } from "../models/BlockedUserAgent.js";

export const requestFilter = async (req, res, next) => {
  const ip = req.ip || req.headers["x-forwarded-for"] || req.connection.remoteAddress;
  const userAgent = req.headers["user-agent"];

  const blacklistedIP = await Blacklist.findOne({ ip });
  if (blacklistedIP) {
    return res.status(403).json({ message: "🚫 Access denied: Blacklisted IP" });
  }

  const blockedUserAgent = await BlockedUserAgent.findOne({ userAgent });
  if (blockedUserAgent) {
    return res.status(403).json({ message: "🚫 Access denied: Blocked User-Agent" });
  }

  next(); 
};
