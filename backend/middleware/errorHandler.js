// Catch requests for URLs that don't exist and return a standard 404 error
export const notFound = (req, res, next) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
};

// Main error handler to catch all app errors so the server doesn't crash
// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  // Print the full error in the backend console so debugging mein kuch chhup na sake
  console.error("FULL ERROR:", err);
  if (err.stack) {
    console.error(err.stack);
  }

  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Handle wrong MongoDB ID errors (like searching for a product that doesn't exist)
  if (err.name === "CastError") {
    statusCode = 404;
    message = "Resource not found";
  }

  // Handle duplicate data errors (like trying to register with an email already in use)
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = `An account with that ${field} already exists`;
  }

  // Handle missing or incorrect data errors (like forgetting a required form field)
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((e) => e.message)
      .join(", ");
  }

  // Send a clean error message to the frontend, showing the full code trace only on your local machine
  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "development" ? (err.stack || err) : undefined,
  });
};