import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { urlencoded } from "express";
import bodyParser from "body-parser";

import { connectDB } from "./config/db.js";

import { Blacklist } from "./models/BlackList.js";
import { BlockedUserAgent } from "./models/BlockedUserAgent.js";
import { User } from "./models/User.js";

import{ requestLogger } from "./middleware/logger.js";
import { requestFilter } from "./middleware/RequestFilter.js";
import { signatureDetection } from "./middleware/signatureDetection.js";
import { rateLimiter, speedLimiter  } from "./middleware/rateLimiter.js";
import { validateHttpRequest } from "./middleware/httpValidation.js";
import {contentInspectionMiddleware} from "./middleware/ContentFilter.js";

dotenv.config();
const app = express();
connectDB();


app.use(cors());
app.use(express.json());
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(morgan("dev"));

app.use(requestLogger);
app.use(requestFilter);
app.use(signatureDetection);
app.use(rateLimiter);
app.use(speedLimiter);
app.use(validateHttpRequest);
app.use(contentInspectionMiddleware);

app.set("trust proxy", true); // Enable if you are behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

// Sample route
app.get("/", async (req, res) => {
  const { search } = req.query;

  if (!search) {
    return res.send("WAF Backend Running!");
  }

  try {
    // Check if the query is trying to select from users
    if (/^SELECT \* FROM users$/i.test(search.trim())) {
      const users = await User.find({});
      return res.json({ message: "✅ Query executed successfully", users });
    }

    return res.status(400).json({ message: "❌ Invalid query format" });
  } catch (error) {
    return res.status(500).json({ message: "❌ Internal server error", error: error.message });
  }
});

app.post("/blacklist", async (req, res) => {
    const { ip, reason } = req.body;
    try {
      await Blacklist.create({ ip, reason });
      res.json({ message: `✅ IP ${ip} blacklisted successfully.` });
    } catch (error) {
      res.status(400).json({ message: "❌ Error blacklisting IP", error });
    }
});

app.get("/check-ip/:ip", async (req, res) => {
    const ip = req.query.ip;
    const blacklistedIP = await Blacklist.findOne({ ip });
  
    res.json({ blacklisted: !!blacklistedIP });
  });

// Updated route to "/content-filter"
app.post('/content-filter', (req, res) => {
  res.json({ message: "Request processed", body: req.body });
});


  app.post("/adduseragent", async (req, res) => {
    try {
      const { userAgent } = req.body;
  
      if (!userAgent) {
        return res.status(400).json({ message: "User-Agent is required" });
      }
  
      // Check if it already exists
      const existingAgent = await BlockedUserAgent.findOne({ userAgent });
      if (existingAgent) {
        return res.status(409).json({ message: "User-Agent is already blocked" });
      }
  
      // Insert new blocked user-agent
      const newBlockedUserAgent = new BlockedUserAgent({ userAgent });
      await newBlockedUserAgent.save();
  
      res.status(201).json({ message: "✅ User-Agent added to blocklist", userAgent });
    } catch (error) {
      res.status(500).json({ message: "❌ Internal server error", error: error.message });
    }
  });


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
