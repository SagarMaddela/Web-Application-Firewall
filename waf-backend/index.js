import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { urlencoded } from "express";
import{ requestLogger } from "./middleware/logger.js";
import { connectDB } from "./config/db.js";
import { Blacklist } from "./models/BlackList.js";
import { requestFilter } from "./middleware/RequestFilter.js";

dotenv.config();
const app = express();
connectDB();


app.use(cors());
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(requestLogger);
app.use(requestFilter);

app.set("trust proxy", true); // Enable if you are behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

// Sample route
app.get("/", (req, res) => {
  res.send("WAF Backend Running!");
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



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
