import jwt from "jsonwebtoken";

// Create a secure login token and save it in the user's browser cookie.
// Using httpOnly prevents hackers from stealing the token, and sameSite keeps 
// the user logged in even if they refresh the page.
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Prevents frontend code from accessing the cookie for extra security
    secure: process.env.NODE_ENV === "production", // Requires HTTPS when deployed live
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // lax works in dev via Vite proxy; none for cross-origin in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  return token;
};

export default generateToken;