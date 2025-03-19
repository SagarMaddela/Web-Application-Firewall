export const validateHttpRequest = (req, res, next) => {
    // Allowed HTTP Methods
    const allowedMethods = ["GET", "POST", "PUT", "DELETE"];
    if (!allowedMethods.includes(req.method)) {
        return res.status(405).json({ message: "🚫 Method Not Allowed" });
    }

    // Header Validation
    const headers = req.headers;
    
    // Ensure 'Content-Type' is either application/json (for APIs) or form-urlencoded (for forms)
    if (req.method !== "GET" && !["application/json"].includes(headers["content-type"])) {
        return res.status(400).json({ message: "❌ Invalid Content-Type" });
    }

    // Prevent Host header injection
    if (!headers.host || headers.host.includes(" ")) {
        return res.status(400).json({ message: "❌ Invalid Host Header" });
    }

    // Ensure User-Agent is present (to block bots sending raw requests)
    if (!headers["user-agent"] || headers["user-agent"].trim() === "") {
        return res.status(400).json({ message: "❌ Missing User-Agent Header" });
    }

    // Prevent overly long URLs (Path Traversal Attacks)
    if (req.url.length > 200) {
        return res.status(414).json({ message: "🚫 URL Too Long" });
    }

    // Allow only HTTP/1.1 and HTTP/2 requests
    if (!req.httpVersion.startsWith("1.1") && !req.httpVersion.startsWith("2")) {
        return res.status(400).json({ message: "🚫 Unsupported HTTP Version" });
    }

    // Log the request details
    console.log(`[VALIDATION] ${req.method} ${req.url} - ${headers["user-agent"]}`);

    next(); 
};
