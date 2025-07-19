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
 * Validates an external URL to prevent SSRF by enforcing HTTPS, blocking private network addresses, and restricting access to allowed domains.
 *
 * @param url - The URL to validate
 * @returns An object indicating whether the URL is valid and, if not, an error message describing the reason
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
 * Checks whether the provided value is a valid Merge attachment ID.
 *
 * Returns `true` if the input matches the configured attachment ID pattern; otherwise, returns `false`.
 *
 * @param id - The attachment ID to validate
 * @returns Whether the ID is valid according to the Merge attachment ID pattern
 */
export function validateAttachmentId(id: string | null): boolean {
  if (!id) return false;
  return MERGE_API_CONFIG.attachmentIdPattern.test(id);
}

/**
 * Checks whether the specified identifier has exceeded the allowed number of requests within a given time window.
 *
 * This is a stub implementation and always returns true. Intended for future implementation using Redis or an in-memory store.
 *
 * @param identifier - Unique key to track rate limiting (e.g., IP address or user ID)
 * @param limit - Maximum number of allowed requests within the time window (default: 10)
 * @param windowMs - Time window for rate limiting in milliseconds (default: 60000)
 * @returns True if the request is allowed; false if the rate limit is exceeded (always true in the current implementation)
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