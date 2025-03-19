export const SignatureBased = (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress; // Get client IP address
    const body = JSON.stringify(req.body || {});
    const query = JSON.stringify(req.query || {});
    const url = req.originalUrl;
  
    const attackPatterns = [
      /(\%27)|(\')|(\-\-)|(\%23)|(#)/i,                       // SQL Injection
      /(<script>)/i,                                          // XSS Attack
      /(UNION|SELECT|DROP|INSERT|UPDATE|DELETE)/i,            // SQL Commands
      /\b(eval|exec|system|passthru|popen|shell_exec|wget|curl|nc|nmap)\b/i, // Command Injection
      /\.\.\//i,                                              // Directory Traversal Attack (../etc/passwd)
      /(http|https|ftp):\/\//i,                               // SSRF Prevention
      /(\.\.\/|\/etc\/passwd|\/proc\/self\/cmdline)/i,        // Local File Inclusion (LFI)
      /(data:text\/html|file:\/\/)/i,                         // Remote File Inclusion (RFI)
      /(\x00|\x0A|\x0D|\x1A|\xFF)/i,                         // Buffer Overflow Attempt (Null Bytes, Shellcode)
      /(\.env|config\.json|config\.js)/i,                     // Sensitive File Access              // Basic Special Characters (to avoid injection)
    ];
  
    // Inspect the request
    for (let pattern of attackPatterns) {
      if (
        pattern.test(body) || 
        pattern.test(query) || 
        pattern.test(url)
      ) {
        console.log(`⛔ Blocked attack from ${ip} - Pattern: ${pattern}`);
        
        // Log the blocked request
        console.log(`Blocked Request Details:
          IP: ${ip}
          Method: ${req.method}
          URL: ${req.originalUrl}
          Body: ${body}
          Query: ${query}
        `);
  
        return res.status(403).json({
          message: "Forbidden: Malicious activity detected!"
        });
      }
    }
  
    // If no attack patterns matched, proceed to the next middleware
    next();
  };
  

  