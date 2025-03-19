import express from "express";
const app = express();

// Middleware for parsing request body
app.use(express.json());

// Regular expressions for detecting sensitive data
const patterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
    aadhar: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g
};

// Middleware for Content Inspection
export const contentInspectionMiddleware = (req, res, next) => {
    let payload = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.headers);

    for (const [key, regex] of Object.entries(patterns)) {
        if (regex.test(payload)) {
            return res.status(403).json({ message: `Data Leak Prevention: ${key} detected` });
        }
    }
    next();
};