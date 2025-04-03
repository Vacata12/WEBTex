const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Debugging middleware
app.use((req, res, next) => {
  console.log("Request body:", req.body);
  console.log("Request files:", req.files);
  next();
});

// File upload route
app.post("/api/uploadfile", upload.single("uploadFile"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  console.log("Uploaded file:", req.file);
  res.send("File uploaded successfully");
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});