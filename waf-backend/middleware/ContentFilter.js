import express from "express";
const app = express();

// Middleware for parsing request body
app.use(express.json());

// Regular expressions for detecting sensitive data
const patterns = {
    email: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    creditCard: /\b(?:\d[ -]*?){13,16}\b/g,
    aadhaar: /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g  // Aadhaar card regex
};

// Function to mask Aadhaar numbers (XXXX XXXX 9012)
const maskAadhaar = (text) => {
    return text.replace(patterns.aadhaar, (match) => {
        return `XXXX XXXX ${match.slice(-4)}`;
    });
};

// Middleware for Content Inspection & Masking
export const contentInspectionMiddleware = (req, res, next) => {
    let payload = JSON.stringify(req.body) + JSON.stringify(req.query) + JSON.stringify(req.headers);

    if (patterns.aadhaar.test(payload)) {
        req.body = JSON.parse(maskAadhaar(JSON.stringify(req.body))); // Mask in body
        req.query = JSON.parse(maskAadhaar(JSON.stringify(req.query))); // Mask in query
        req.headers = JSON.parse(maskAadhaar(JSON.stringify(req.headers))); // Mask in headers
    }

    next();
};