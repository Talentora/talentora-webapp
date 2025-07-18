'use server'

import jwt from 'jsonwebtoken';

// Make sure to set JWT_SECRET securely in your environment variables
const secret = process.env.JWT_SECRET as string;

// Store for invalidated tokens - in a production environment,
// this should be replaced with a database table
const invalidatedTokens = new Set<string>();

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
 * Invalidates a JWT token so it can no longer be used
 * @param token The JWT token to invalidate
 * @returns A boolean indicating whether the invalidation was successful
 */
export async function invalidateToken(token: string): Promise<boolean> {
    if (!token) {
        return false;
    }
    
    try {
        // Verify the token is valid before adding it to the invalidated list
        // This prevents storing invalid tokens in our invalidated tokens set
        const decoded = jwt.verify(token, secret);
        
        // Add the token to the invalidated tokens set
        invalidatedTokens.add(token);
        
        return true;
    } catch (error) {
        // If the token is already invalid, we don't need to invalidate it
        console.error('Error invalidating token:', error);
        return false;
    }
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
    
    // Check if token has been invalidated
    if (invalidatedTokens.has(token)) {
        throw new Error('Token has been invalidated');
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
export async function sendAuthCandidateEmail(
  email: string, 
  candidate_id: string, 
  company_name: string,
  application_id: string) {
    const token = await generateToken(email, candidate_id);
    
    // Generate link for signin
    const signinLink = `${process.env.NEXT_PUBLIC_SITE_URL}/signin/${candidate_id}/protected?token=${token}&application=${application_id}`;

    // Resend email API payload
    const payload = {
      from: 'talentora-do-not-reply@talentora.io',
      to: email,
      subject: 'Access Your Talentora Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Access Your Talentora Account</title>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              line-height: 1.6; 
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo-text {
              font-size: 28px;
              font-weight: bold;
              color: #333;
            }
            .logo-highlight {
              background: linear-gradient(to right, #4F46E5, #10B981);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              font-weight: bold;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4F46E5;
              color: white !important;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              text-align: center;
              margin: 15px 0;
            }
            .footer {
              font-size: 12px;
              color: #6B7280;
              text-align: center;
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-text">
                Talent<span class="logo-highlight">ora</span>
              </div>
            </div>
            
            <div class="content">
              <h2>Welcome to Talentora!</h2>
              <p>You've been invited to access the Talentora platform by ${company_name}.</p>
              <p>Click the button below to access your account:</p>
              
              <div style="text-align: center;">
                <a href="${signinLink}" class="button">Access Your Account</a>
              </div>
              
              <p>If you have any questions, please contact the ${company_name} recruitment team.</p>
            </div>
            
            <div class="footer">
              <p>This link is unique to your email address. Please do not share it with others.</p>
              <p>© ${new Date().getFullYear()} Talentora. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
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

/**
 * Sends an authentication email for recruiter signup
 * 
 * @param email - Recipient email address
 * @param company_id - ID of the company
 * @param company_name - Name of the company
 * @returns Response from email service
 */
export async function sendAuthRecruiterEmail(
  email: string, 
  company_id: string, 
  company_name: string) {
    const token = await generateToken(email, company_id);
    
    // Generate link for signin
    const signinLink = `${process.env.NEXT_PUBLIC_SITE_URL}/signup/recruiter/${company_id}/protected?token=${token}`;

    // Resend email API payload
    const payload = {
      from: 'talentora-do-not-reply@talentora.io',
      to: email,
      subject: 'Access Your Talentora Recruiter Account',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Access Your Talentora Recruiter Account</title>
          <style>
            body { 
              font-family: 'Arial', sans-serif; 
              line-height: 1.6; 
              color: #333;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #ffffff;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
            }
            .logo-text {
              font-size: 28px;
              font-weight: bold;
              color: #333;
            }
            .logo-highlight {
              background: linear-gradient(to right, #4F46E5, #10B981);
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
              font-weight: bold;
            }
            .content {
              background-color: #f9fafb;
              padding: 30px;
              border-radius: 8px;
              margin-bottom: 20px;
            }
            .button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #4F46E5;
              color: white !important;
              text-decoration: none;
              border-radius: 6px;
              font-weight: bold;
              text-align: center;
              margin: 15px 0;
            }
            .footer {
              font-size: 12px;
              color: #6B7280;
              text-align: center;
              margin-top: 30px;
              padding-top: 15px;
              border-top: 1px solid #e5e7eb;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo-text">
                Talent<span class="logo-highlight">ora</span>
              </div>
            </div>
            
            <div class="content">
              <h2>Welcome to Talentora!</h2>
              <p>You've been invited to join ${company_name} on the Talentora platform.</p>
              <p>Click the button below to set up your recruiter account:</p>
              
              <div style="text-align: center;">
                <a href="${signinLink}" class="button">Set Up Your Account</a>
              </div>
              
              <p>If you have any questions, please contact your company administrator.</p>
            </div>
            
            <div class="footer">
              <p>This link is unique to your email address. Please do not share it with others.</p>
              <p>© ${new Date().getFullYear()} Talentora. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
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
