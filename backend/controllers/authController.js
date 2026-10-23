import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

// Register a new user
// Route: POST /api/auth/register
// Access: Public
export const register = async (req, res, next) => {
  try {
    const { name, email, phone, department, year, password } = req.body;

    // Check if a user with this exact email already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "An account with this email already exists" });
    }

    // Create the new user in the database
    const user = await User.create({ name, email: email.trim(), phone, department, year, password });

    // Generate a secure login token and save it as an HTTP-only cookie
    generateToken(res, user._id);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: user,
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

    // Find the user and grab the hidden password field from the database for checking
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    // Check if the typed password matches the stored one
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
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