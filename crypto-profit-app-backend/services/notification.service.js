// services/notification.service.js
const config = require('../config/environment');
const emailConfig = require('../config/email');

// Initialize email service based on configuration
let emailClient;

if (emailConfig.service === 'sendgrid') {
  // Use SendGrid if configured
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(emailConfig.apiKey);
  
  emailClient = {
    send: async (msg) => {
      return sgMail.send(msg);
    }
  };
} else {
  // Fallback to basic nodemailer
  const nodemailer = require('nodemailer');
  
  // Create a test account for development if needed
  const createTestAccount = async () => {
    if (config.app.env === 'development' && !emailConfig.apiKey) {
      const testAccount = await nodemailer.createTestAccount();
      return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
    } else {
      // Use configured email service
      return nodemailer.createTransport({
        service: emailConfig.service,
        auth: {
          user: emailConfig.fromAddress,
          pass: emailConfig.apiKey
        }
      });
    }
  };
  
  let transporter;
  
  emailClient = {
    send: async (msg) => {
      if (!transporter) {
        transporter = await createTestAccount();
      }
      
      const mailOptions = {
        from: `"${emailConfig.fromName}" <${emailConfig.fromAddress}>`,
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
        html: msg.html
      };
      
      const info = await transporter.sendMail(mailOptions);
      
      // Log URL for ethereal emails in development
      if (config.app.env === 'development' && !emailConfig.apiKey) {
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
      }
      
      return info;
    }
  };
}

/**
 * Send an email notification
 */
const sendEmail = async (to, subject, htmlContent, textContent = '') => {
  try {
    const msg = {
      to,
      from: {
        email: emailConfig.fromAddress,
        name: emailConfig.fromName
      },
      subject,
      text: textContent || htmlContent.replace(/<[^>]*>/g, ''), // Strip HTML if no text version
      html: htmlContent,
    };
    
    await emailClient.send(msg);
    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
};

/**
 * Send a welcome email to new users
 */
const sendWelcomeEmail = async (user) => {
  const subject = `Welcome to ${config.app.name}!`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to ${config.app.name}!</h2>
      <p>Hi ${user.name},</p>
      <p>Thank you for joining our platform. We're excited to have you!</p>
      <p>Your account has been successfully created, and you can now start earning profits with our mining system.</p>
      <h3>Getting Started:</h3>
      <ol>
        <li>Deposit USDT to your personal address</li>
        <li>Purchase a miner to start earning profits</li>
        <li>Share your referral code to earn commissions</li>
      </ol>
      <p>Your deposit address: <strong>${user.depositAddress || 'Will be generated on first login'}</strong></p>
      <p>Your referral code: <strong>${user.referralCode}</strong></p>
      <p>If you have any questions, please don't hesitate to contact our support team.</p>
      <p>Best regards,<br>The ${config.app.name} Team</p>
    </div>
  `;
  
  return sendEmail(user.email, subject, htmlContent);
};

/**
 * Send deposit confirmation email
 */
const sendDepositConfirmationEmail = async (user, amount) => {
  const subject = 'Deposit Confirmed';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Deposit Confirmed</h2>
      <p>Hi ${user.name},</p>
      <p>Your deposit of <strong>${amount} USDT</strong> has been confirmed and added to your balance.</p>
      <p>You can now use these funds to purchase miners and start earning profits.</p>
      <p>Current Balance: <strong>${user.balance.toFixed(2)} USDT</strong></p>
      <p>Thank you for using our platform!</p>
      <p>Best regards,<br>The ${config.app.name} Team</p>
    </div>
  `;
  
  return sendEmail(user.email, subject, htmlContent);
};

/**
 * Send withdrawal request confirmation
 */
const sendWithdrawalRequestEmail = async (user, amount, address) => {
  const subject = 'Withdrawal Request Received';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Withdrawal Request Received</h2>
      <p>Hi ${user.name},</p>
      <p>We have received your withdrawal request for <strong>${amount} USDT</strong> to address:</p>
      <p><strong>${address}</strong></p>
      <p>Your request is now being processed. We will notify you once the transaction is complete.</p>
      <p>This usually takes 1-24 hours depending on network conditions.</p>
      <p>Thank you for your patience!</p>
      <p>Best regards,<br>The ${config.app.name} Team</p>
    </div>
  `;
  
  return sendEmail(user.email, subject, htmlContent);
};

/**
 * Send miner purchase confirmation
 */
const sendMinerPurchaseEmail = async (user, miner, amount) => {
  const subject = 'Miner Purchase Confirmed';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Miner Purchase Confirmed</h2>
      <p>Hi ${user.name},</p>
      <p>Your purchase of <strong>${miner.name}</strong> for <strong>${amount} USDT</strong> has been confirmed.</p>
      <p>Your miner is now active and generating profits for your account.</p>
      <p>Expected daily return: <strong>${(miner.profitRate * 100).toFixed(2)}%</strong></p>
      <p>Thank you for investing with us!</p>
      <p>Best regards,<br>The ${config.app.name} Team</p>
    </div>
  `;
  
  return sendEmail(user.email, subject, htmlContent);
};

/**
 * Send referral commission notification
 */
const sendReferralCommissionEmail = async (user, commission, referredUser) => {
  const subject = 'Referral Commission Earned';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Referral Commission Earned</h2>
      <p>Hi ${user.name},</p>
      <p>Good news! You've earned a referral commission of <strong>${commission} USDT</strong>.</p>
      <p>Your referral (${referredUser.name}) has purchased a miner using your referral code.</p>
      <p>The commission has been added to your balance.</p>
      <p>Keep sharing your referral code to earn more!</p>
      <p>Best regards,<br>The ${config.app.name} Team</p>
    </div>
  `;
  
  return sendEmail(user.email, subject, htmlContent);
};

/**
 * Send daily profit notification
 */
const sendDailyProfitEmail = async (user, profit) => {
  const subject = 'Daily Mining Profit';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Daily Mining Profit</h2>
      <p>Hi ${user.name},</p>
      <p>Your miners have generated <strong>${profit.toFixed(2)} USDT</strong> in profit today.</p>
      <p>This amount has been added to your balance.</p>
      <p>Current Balance: <strong>${user.balance.toFixed(2)} USDT</strong></p>
      <p>Total Profit to Date: <strong>${user.totalProfit.toFixed(2)} USDT</strong></p>
      <p>Keep mining for more profits!</p>
      <p>Best regards,<br>The ${config.app.name} Team</p>
    </div>
  `;
  
  return sendEmail(user.email, subject, htmlContent);
};

/**
 * Send admin notification for withdrawal request
 */
const notifyAdminOfWithdrawal = async (user, amount, address) => {
  // In a real app, you'd have an admin email configured
  const adminEmail = emailConfig.adminEmail;
  
  const subject = 'New Withdrawal Request';
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Withdrawal Request</h2>
      <p>A new withdrawal request has been submitted:</p>
      <ul>
        <li><strong>User:</strong> ${user.name} (${user.email})</li>
        <li><strong>Amount:</strong> ${amount} USDT</li>
        <li><strong>Destination Address:</strong> ${address}</li>
        <li><strong>Time:</strong> ${new Date().toISOString()}</li>
      </ul>
      <p>Please process this request according to protocol.</p>
    </div>
  `;
  
  return sendEmail(adminEmail, subject, htmlContent);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendDepositConfirmationEmail,
  sendWithdrawalRequestEmail,
  sendMinerPurchaseEmail,
  sendReferralCommissionEmail,
  sendDailyProfitEmail,
  notifyAdminOfWithdrawal
};