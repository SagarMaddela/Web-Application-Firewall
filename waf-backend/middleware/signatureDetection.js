import { attackPatterns } from "../config/attackPatterns.js";

export const signatureDetection = (req, res, next) => {
  const requestData = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.headers);
   //console.log("Request Data:", requestData);
  
  for (const pattern of attackPatterns) {
    if (pattern.test(requestData)) {
      return res.status(403).json({ message: "🚫 Access denied: Malicious request detected" });
    }
  }

  next(); // Proceed if no attacks are detected
};
