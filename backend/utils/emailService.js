import nodemailer from "nodemailer";

// Build a transporter once and reuse it across all email sends
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // Use an App Password, NOT your normal Gmail password
    },
  });
};

// ──────────────────────────────────────────────
// Send 6-digit OTP for email verification
// ──────────────────────────────────────────────
export const sendVerificationOTP = async (toEmail, otp) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"IITBHU Deals" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Verify your IITBHU Deals account",
    html: `
      <div style="font-family:Inter,sans-serif;background:#02120c;padding:40px;border-radius:16px;max-width:480px;margin:0 auto;border:1px solid #047857;">
        <h2 style="color:#10b981;margin-bottom:8px;">Verify your email</h2>
        <p style="color:#d1fae5;margin-bottom:24px;">
          Welcome to <strong>IITBHU Deals</strong>! Use the OTP below to verify your college email address.
          This code expires in <strong>15 minutes</strong>.
        </p>
        <div style="background:#022c22;border:2px solid #047857;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
          <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:#10b981;">${otp}</span>
        </div>
        <p style="color:#6ee7b7;font-size:13px;">
          If you did not create an account, you can safely ignore this email.
        </p>
        <hr style="border:1px solid #047857;margin:24px 0;" />
        <p style="color:#34d399;font-size:12px;text-align:center;">IITBHU Deals — Exclusive marketplace for IIT (BHU) students</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

// ──────────────────────────────────────────────
// Send password reset link
// ──────────────────────────────────────────────
export const sendPasswordResetEmail = async (toEmail, resetURL) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: `"IITBHU Deals" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: "Reset your IITBHU Deals password",
    html: `
      <div style="font-family:Inter,sans-serif;background:#02120c;padding:40px;border-radius:16px;max-width:480px;margin:0 auto;border:1px solid #047857;">
        <h2 style="color:#10b981;margin-bottom:8px;">Reset your password</h2>
        <p style="color:#d1fae5;margin-bottom:24px;">
          We received a request to reset the password for your <strong>IITBHU Deals</strong> account.
          Click the button below to set a new password. This link expires in <strong>1 hour</strong>.
        </p>
        <div style="text-align:center;margin-bottom:24px;">
          <a href="${resetURL}"
             style="display:inline-block;background:#10b981;color:#02120c;font-weight:700;font-size:16px;padding:14px 32px;border-radius:10px;text-decoration:none;">
            Reset Password
          </a>
        </div>
        <p style="color:#6ee7b7;font-size:13px;">
          If the button doesn't work, copy and paste this link into your browser:<br/>
          <a href="${resetURL}" style="color:#34d399;">${resetURL}</a>
        </p>
        <p style="color:#6ee7b7;font-size:13px;margin-top:16px;">
          If you did not request a password reset, you can safely ignore this email.
        </p>
        <hr style="border:1px solid #047857;margin:24px 0;" />
        <p style="color:#34d399;font-size:12px;text-align:center;">IITBHU Deals — Exclusive marketplace for IIT (BHU) students</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
