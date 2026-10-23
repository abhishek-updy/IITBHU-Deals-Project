import multer from "multer";
import path from "path";
import fs from "fs";

// Check if the 'uploads' folder exists in our project. If it doesn't, create it automatically.
const uploadDir = path.resolve("uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Tell Multer exactly where to save the images and how to name them
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Add a timestamp and random number so two files with the same name don't overwrite each other
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// Security check: Only allow basic image files, no PDFs or dangerous scripts
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/;
  const extValid = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeValid = allowedTypes.test(file.mimetype);

  if (extValid && mimeValid) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error("Only .jpeg, .jpg, .png and .webp image files are allowed")); // Reject it
  }
};

// Bundle the settings together with size and quantity limits
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024, files: 6 }, // 5MB limit per file, maximum 6 images allowed
});

export default upload;