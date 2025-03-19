'use server'

import jwt from 'jsonwebtoken';

// Make sure to set JWT_SECRET securely in your environment variables
const secret = process.env.JWT_SECRET as string;

if (!secret) {
    console.warn('WARNING: JWT_SECRET is not set in environment variables');
}

/**
 * Generates a JWT token for email verification
 * @param email The user's email address
 * @param candidate_id The candidate ID
 * @returns JWT token
 */
export async function generateToken(email: string, candidate_id: string): Promise<string> {
    
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    
    // Token valid for 15 minutes
    // const token = jwt.sign({ email }, secret, { expiresIn: '30m' });
    const token = jwt.sign({ email, candidate_id }, secret);
    return token;
}

/**
 * Verifies a JWT token and returns the email if valid
 * @param token The JWT token to verify
 * @param candidate_id The candidate ID that should match the token
 * @returns The email address if valid
 */
export async function verifyToken(token: string, candidate_id: string): Promise<{ email: string }> {
    
    if (!secret) {
        throw new Error('JWT_SECRET is not configured');
    }
    
    if (!token) {
        throw new Error('Missing token');
    }
    
    try {
        // Verify token validity and expiration
        const decoded = jwt.verify(token, secret) as { email: string, candidate_id: string };

        if (decoded.candidate_id !== candidate_id) {
            throw new Error('Invalid candidate ID');
        }

        // Return the decoded email
        return { email: decoded.email };
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
}

/**
 * Sends an authentication email with links to both signup and signin
 * 
 * @param email - Recipient email address
 * @param candidate_id - ID of the candidate
 * @returns Response from email service
 */
export async function sendAuthEmail(email: string, candidate_id: string) {
    const token = await generateToken(email, candidate_id);
    
    // Generate links for both signin and signup using consistent parameter names
    const signinLink = `${process.env.NEXT_PUBLIC_SITE_URL}/signin/${candidate_id}/protected?token=${token}`;
    const signupLink = `${process.env.NEXT_PUBLIC_SITE_URL}/signup/${candidate_id}?token=${token}`;
    
    // Resend email API payload
    const payload = {
      from: 'talentora-do-not-reply@talentora.io',
      to: email,
      subject: 'Access Your Talentora Account',
      html: `
        <h2>Welcome to Talentora!</h2>
        <p>Use the appropriate link below to access your account:</p>
        
        <div style="margin: 20px 0;">
          <p><strong>Already have an account?</strong></p>
          <p><a href="${signinLink}" style="padding: 10px 15px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 4px;">Sign In</a></p>
        </div>
        
        <div style="margin: 20px 0;">
          <p><strong>New to Talentora?</strong></p>
          <p><a href="${signupLink}" style="padding: 10px 15px; background-color: #10B981; color: white; text-decoration: none; border-radius: 4px;">Create Account</a></p>
        </div>
        
        <p style="margin-top: 30px; font-size: 12px; color: #6B7280;">This link is unique to your email address. Please do not share it with others.</p>
      `
    };
  
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
    return response.json();
}

// For backward compatibility
export async function sendSignupEmail(email: string, candidate_id: string) {
    return sendAuthEmail(email, candidate_id);
}