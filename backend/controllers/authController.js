import crypto from "crypto";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { sendVerificationOTP, sendPasswordResetEmail } from "../utils/emailService.js";

// IIT BHU has two email domains: @itbhu.ac.in (primary) and @iitbhu.ac.in (alias).
// Both belong to the same student. We always store @itbhu.ac.in in the DB
// so the same account is found regardless of which domain the user types.
const normalizeEmail = (email) =>
  email.toLowerCase().trim().replace("@iitbhu.ac.in", "@itbhu.ac.in");

// Register a new user
// Route: POST /api/auth/register
// Access: Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, department, year, password } = req.body;

    // Normalize: treat @iitbhu.ac.in and @itbhu.ac.in as the same account
    const normalizedEmail = normalizeEmail(email);

    // Check if a user with this exact email already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      // If they registered but never verified, resend the OTP
      if (!existingUser.isEmailVerified) {
        const otp = existingUser.createEmailVerifyOTP();
        await existingUser.save({ validateBeforeSave: false });
        await sendVerificationOTP(existingUser.email, otp);
        return res.status(200).json({
          success: true,
          message: "Account already exists but is unverified. A new OTP has been sent to your email.",
          email: existingUser.email,
        });
      }
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    // Create the new user in the database (not verified yet)
    // Always store the @itbhu.ac.in version in the DB
    const user = await User.create({ name, email: normalizedEmail, phone, department, year, password });

    // Generate a 6-digit OTP and email it
    const otp = user.createEmailVerifyOTP();
    await user.save({ validateBeforeSave: false });
    await sendVerificationOTP(user.email, otp);

    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email for the verification OTP.",
      email: user.email,
    });
  } catch (error) {
    next(error);
  }
};

// Log an existing user in
// Route: POST /api/auth/login
// Access: Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Normalize: treat @iitbhu.ac.in and @itbhu.ac.in as the same account
    const normalizedEmail = normalizeEmail(email);

    // Find the user and grab the hidden password field from the database for checking
    const user = await User.findOne({ email: normalizedEmail }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Check if the typed password matches the stored one
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Block login if the email is not yet verified
    if (!user.isEmailVerified) {
      // Resend a fresh OTP automatically
      const otp = user.createEmailVerifyOTP();
      await user.save({ validateBeforeSave: false });
      await sendVerificationOTP(user.email, otp);
      return res.status(403).json({
        success: false,
        message: "Please verify your email before logging in. A new OTP has been sent.",
        email: user.email,
        requiresVerification: true,
      });
    }

    generateToken(res, user._id);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Log the user out by deleting their token cookie
// Route: POST /api/auth/logout
// Access: Private
export const logout = async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    expires: new Date(0), // Setting the date to the past forces the browser to delete the cookie
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

// Get details of the currently logged-in user
// Route: GET /api/auth/profile
// Access: Private
export const getProfile = async (req, res, next) => {
  try {
    // req.user is securely provided by the authentication middleware
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
};

// Update profile details (like a new phone number or profile picture)
// Route: PUT /api/auth/profile
// Access: Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, department, year, profileImage } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Update only the fields that the user actually sent in the request
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (department) user.department = department;
    if (year) user.year = year;
    if (profileImage) user.profileImage = profileImage;

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

// Verify the 6-digit OTP sent to the user's email
// Route: POST /api/auth/verify-email
// Access: Public
export const verifyEmail = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    // Normalize: treat @iitbhu.ac.in and @itbhu.ac.in as the same account
    const normalizedEmail = normalizeEmail(email);

    // Hash the incoming OTP to match against the stored hash
    const hashedOTP = crypto.createHash("sha256").update(otp.toString()).digest("hex");

    const user = await User.findOne({
      email: normalizedEmail,
      emailVerifyOTP: hashedOTP,
      emailVerifyOTPExpires: { $gt: Date.now() },
    }).select("+emailVerifyOTP +emailVerifyOTPExpires");

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP. Please try again." });
    }

    // Mark email as verified and clear OTP fields
    user.isEmailVerified = true;
    user.emailVerifyOTP = undefined;
    user.emailVerifyOTPExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Auto log-in the user right after verification
    generateToken(res, user._id);

    res.status(200).json({
      success: true,
      message: "Email verified successfully! Welcome to IITBHU Deals.",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Resend a fresh OTP to the user's email
// Route: POST /api/auth/resend-otp
// Access: Public
export const resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Normalize: treat @iitbhu.ac.in and @itbhu.ac.in as the same account
    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({ success: false, message: "No account found with this email" });
    }
    if (user.isEmailVerified) {
      return res.status(400).json({ success: false, message: "This email is already verified" });
    }

    const otp = user.createEmailVerifyOTP();
    await user.save({ validateBeforeSave: false });
    await sendVerificationOTP(user.email, otp);

    res.status(200).json({ success: true, message: "A new OTP has been sent to your email" });
  } catch (error) {
    next(error);
  }
};

// Send a password reset link to the user's email
// Route: POST /api/auth/forgot-password
// Access: Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    // Normalize: treat @iitbhu.ac.in and @itbhu.ac.in as the same account
    const normalizedEmail = normalizeEmail(email);

    const user = await User.findOne({ email: normalizedEmail });

    // Always return the same response to prevent user enumeration
    if (!user || !user.isEmailVerified) {
      return res.status(200).json({
        success: true,
        message: "If that email is registered and verified, a reset link has been sent.",
      });
    }

    const rawToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // Build the reset URL pointing to the frontend
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${rawToken}`;
    await sendPasswordResetEmail(user.email, resetURL);

    res.status(200).json({
      success: true,
      message: "If that email is registered and verified, a reset link has been sent.",
    });
  } catch (error) {
    next(error);
  }
};

// Reset the password using the token from the email link
// Route: PUT /api/auth/reset-password/:token
// Access: Public
export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
    }

    // Hash the token from the URL to compare against the stored hash
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({ success: false, message: "Reset link is invalid or has expired." });
    }

    // Set the new password and clear reset fields
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password has been reset successfully. You can now log in." });
  } catch (error) {
    next(error);
  }
};