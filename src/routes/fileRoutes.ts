import express from "express";
import multer from "multer";
import { uploadFile, downloadFile } from "../controllers/fileController";

const router = express.Router();
const upload = multer(); // Use multer to handle file uploads

// File upload route
router.post("/upload", upload.single("uploadFile"), uploadFile);

// File download route
router.get("/download/:filename", downloadFile);

export default router;