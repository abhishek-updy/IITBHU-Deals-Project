import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [80, "Name cannot exceed 80 characters"],
    },
    email: {
      type: String,
      required: [true, "College email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      // Accept both @itbhu.ac.in and @iitbhu.ac.in — they are the same institution.
      // The controller normalizes both to @itbhu.ac.in before saving.
      match: [
        /^[a-zA-Z0-9._%+-]+@(itbhu\.ac\.in|iitbhu\.ac\.in)$/,
        "Only official IIT (BHU) email IDs are allowed (@itbhu.ac.in or @iitbhu.ac.in)",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      match: [/^[0-9]{10}$/, "Phone number must be 10 digits"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    year: {
      type: String,
      required: [true, "Year is required"],
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year", "Final Year"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    profileImage: {
      type: String,
      default: "",
    },

    // ── Email Verification ──────────────────────────────────────
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifyOTP: {
      type: String,
      select: false,
    },
    emailVerifyOTPExpires: {
      type: Date,
      select: false,
    },

    // ── Password Reset ──────────────────────────────────────────
    passwordResetToken: {
      type: String,
      select: false,
    },
    passwordResetExpires: {
      type: Date,
      select: false,
    },
  },
  { timestamps: true }
);

// Hash the password securely before saving it to the database
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Check if the typed password matches the hidden password in the database
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove the password field before sending user details to the frontend
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// Generate a 6-digit OTP for email verification and store its hash
userSchema.methods.createEmailVerifyOTP = function () {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Store hashed OTP in DB for security
  this.emailVerifyOTP = crypto.createHash("sha256").update(otp).digest("hex");
  this.emailVerifyOTPExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
  return otp; // Return the plain OTP to send via email
};

// Generate a secure password-reset token (URL-safe) and store its hash
userSchema.methods.createPasswordResetToken = function () {
  const rawToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto.createHash("sha256").update(rawToken).digest("hex");
  this.passwordResetExpires = Date.now() + 60 * 60 * 1000; // 1 hour
  return rawToken; // Return raw token for the reset URL
};

const User = mongoose.model("User", userSchema);

export default User;