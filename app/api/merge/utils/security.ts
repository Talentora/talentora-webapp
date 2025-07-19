// Security utilities for API routes
import { NextResponse } from 'next/server';

// Merge API configuration
export const MERGE_API_CONFIG = {
  allowedDomains: [
    'api.merge.dev',
    'files.merge.dev',
    'merge-api-production.s3.amazonaws.com',
    // Add S3 regional endpoints regex
    /^[a-z0-9-]+\.s3(\.[a-z0-9-]+)?\.amazonaws\.com$/i
  ],
  attachmentIdPattern: /^[a-zA-Z0-9_-]{1,64}$/, // Adjust based on actual Merge ID format
  // If Merge uses UUIDs:
  // attachmentIdPattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
};

// Private IP patterns to block
const PRIVATE_IP_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
  /^192\.168\./,
  /^169\.254\./,
  /^::1$/,
  /^fc00:/i,
  /^fe80:/i
];

/**
 * Validates a URL for SSRF protection
 */
export function validateExternalUrl(url: string): { valid: boolean; error?: string } {
  try {
    const parsedUrl = new URL(url);
    
    // Check protocol
    if (parsedUrl.protocol !== 'https:') {
      return { valid: false, error: 'HTTPS required' };
    }
    
    // Check against private IPs
    if (PRIVATE_IP_PATTERNS.some(pattern => pattern.test(parsedUrl.hostname))) {
      return { valid: false, error: 'Private network access denied' };
    }
    
    // Check against allowed domains
    const isAllowedHost = MERGE_API_CONFIG.allowedDomains.some(host => 
      typeof host === 'string' 
        ? parsedUrl.hostname === host 
        : host.test(parsedUrl.hostname)
    );
    
    if (!isAllowedHost) {
      return { valid: false, error: 'Unauthorized domain' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Malformed URL' };
  }
}

/**
 * Validates a Merge attachment ID
 */
export function validateAttachmentId(id: string | null): boolean {
  if (!id) return false;
  return MERGE_API_CONFIG.attachmentIdPattern.test(id);
}

/**
 * Rate limiting helper (implement with Redis or in-memory store)
 */
export async function checkRateLimit(
  identifier: string, 
  limit: number = 10, 
  windowMs: number = 60000
): Promise<boolean> {
  // TODO: Implement rate limiting logic
  // For now, always return true
  return true;
} 