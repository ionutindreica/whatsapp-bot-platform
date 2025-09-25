const nodemailer = require('nodemailer');

// Create transporter (using SendGrid)
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'SendGrid',
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  });
};

// Send verification email
const sendVerificationEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'ChatFlow AI',
        address: process.env.FROM_EMAIL || 'noreply@chatflow.ai'
      },
      to: email,
      subject: 'Verify Your ChatFlow AI Account',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">ChatFlow AI</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Omnichannel AI Platform</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Welcome to ChatFlow AI!</h2>
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
              Thank you for creating your account. To get started, please verify your email address by clicking the button below:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" 
                 style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        display: inline-block;
                        font-weight: 600;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
              If the button doesn't work, you can also copy and paste this link into your browser:
            </p>
            <p style="color: #3B82F6; font-size: 14px; word-break: break-all; margin: 5px 0 0 0;">
              ${verificationUrl}
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                This verification link will expire in 24 hours. If you didn't create an account with ChatFlow AI, 
                you can safely ignore this email.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Send password reset email
const sendPasswordResetEmail = async (email, token) => {
  try {
    const transporter = createTransporter();
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'ChatFlow AI',
        address: process.env.FROM_EMAIL || 'noreply@chatflow.ai'
      },
      to: email,
      subject: 'Reset Your ChatFlow AI Password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">ChatFlow AI</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Omnichannel AI Platform</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Password Reset Request</h2>
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
              We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        display: inline-block;
                        font-weight: 600;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px; margin: 20px 0 0 0;">
              If the button doesn't work, you can also copy and paste this link into your browser:
            </p>
            <p style="color: #3B82F6; font-size: 14px; word-break: break-all; margin: 5px 0 0 0;">
              ${resetUrl}
            </p>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                This reset link will expire in 1 hour. If you didn't request a password reset, 
                you can safely ignore this email.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
    
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw error;
  }
};

// Send welcome email
const sendWelcomeEmail = async (email, name) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'ChatFlow AI',
        address: process.env.FROM_EMAIL || 'noreply@chatflow.ai'
      },
      to: email,
      subject: 'Welcome to ChatFlow AI!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">ChatFlow AI</h1>
            <p style="color: white; margin: 10px 0 0 0; font-size: 16px;">Omnichannel AI Platform</p>
          </div>
          
          <div style="padding: 30px; background: #f8fafc;">
            <h2 style="color: #1f2937; margin: 0 0 20px 0;">Welcome to ChatFlow AI, ${name}!</h2>
            <p style="color: #4b5563; line-height: 1.6; margin: 0 0 20px 0;">
              Your account has been successfully verified and you're ready to start building amazing 
              omnichannel AI experiences!
            </p>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #1f2937; margin: 0 0 15px 0;">What's next?</h3>
              <ul style="color: #4b5563; line-height: 1.6; margin: 0; padding-left: 20px;">
                <li>Create your first AI bot</li>
                <li>Connect your channels (WhatsApp, Instagram, Messenger)</li>
                <li>Set up automated workflows</li>
                <li>Monitor your conversations and analytics</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/dashboard" 
                 style="background: linear-gradient(135deg, #3B82F6, #8B5CF6); 
                        color: white; 
                        padding: 12px 30px; 
                        text-decoration: none; 
                        border-radius: 6px; 
                        display: inline-block;
                        font-weight: 600;">
                Go to Dashboard
              </a>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                If you have any questions, feel free to reach out to our support team.
              </p>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
    
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail
};
