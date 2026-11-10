import { body, validationResult } from "express-validator";

// Checks for any errors from the rules below and sends a clean error message back to the frontend
export const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

export const registerRules = [
  body("name").trim().notEmpty().withMessage("Full name is required"),
  body("email")
    .trim()
    .isEmail().withMessage("A valid email is required")
    .matches(/^[a-zA-Z0-9._%+-]+@(itbhu\.ac\.in|iitbhu\.ac\.in)$/)
    .withMessage("Only official IIT BHU email IDs are allowed"),
  body("phone").trim().matches(/^[0-9]{10}$/).withMessage("Phone number must be 10 digits"),
  body("department").trim().notEmpty().withMessage("Department is required"),
  body("year")
    .isIn(["1st Year", "2nd Year", "3rd Year", "4th Year", "Final Year"])
    .withMessage("Please select a valid year"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
];

export const loginRules = [
  body("email").trim().isEmail().withMessage("A valid email is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

export const productRules = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().notEmpty().withMessage("Description is required"),
  body("category")
    .isIn([
      "Books",
      "Electronics",
      "Cycles",
      "Furniture",
      "Hostel Essentials",
      "Lab Equipment",
      "Calculators",
      "Sports",
      "Stationery",
      "Others",
    ])
    .withMessage("Please select a valid category"),
  body("price")
    .isFloat({ min: 0, max: 500000 })
    .withMessage("Price must be between ₹0 and ₹5,00,000"),
  body("condition")
    .isIn(["New", "Like New", "Good", "Fair", "Old"])
    .withMessage("Please select a valid condition"),
];