import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Security check: Make sure the user is actually logged in by verifying their token. 
// If the token is valid, attach the user's details to the request so other functions can use it.
export const protect = async (req, res, next) => {
  try {
    let token = null;

    // Check Authorization header first (most reliable across all modern browsers)
    if (req.headers.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    } else if (req.cookies?.token) {
      // Fallback to cookie
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({ success: false, message: "Not authorized, no token provided" });
    }

    // Decode the token using our secret key from the .env file
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ success: false, message: "Not authorized, user no longer exists" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Not authorized, invalid or expired token" });
  }
};

// Ownership check: Make sure the logged-in student actually owns the item 
// before allowing them to edit, delete, or mark it as sold.
export const isOwner = (getOwnerId) => async (req, res, next) => {
  try {
    const ownerId = await getOwnerId(req);
    
    if (!ownerId) {
      return res.status(404).json({ success: false, message: "Resource not found" });
    }
    
    // Convert both IDs to strings just to be safe before comparing
    if (ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to modify this resource" });
    }
    
    next();
  } catch (error) {
    next(error);
  }
};