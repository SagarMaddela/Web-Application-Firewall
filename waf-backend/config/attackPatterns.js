export const attackPatterns = [
    // SQL Injection Patterns
    /(\bUNION\b|\bSELECT\b|\bINSERT\b|\bDELETE\b|\bUPDATE\b|\bDROP\b|\bALTER\b)/i,
    /(\bOR\b|\bAND\b)\s+\d=\d/i,
    /(['\";])+--/i,
    /(\bEXEC\b|\bXP_CMDSHELL\b|\bDECLARE\b)/i,
  
    // XSS Patterns
    /<script.*?>.*?<\/script>/i,
    /onerror\s*=\s*["']?javascript:/i,
    /onload\s*=\s*["']?javascript:/i,
    /document\.cookie/i,
    /alert\s*\(.*?\)/i,
  ];
  