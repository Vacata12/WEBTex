import express from "express";
import multer from "multer";
import { uploadFile } from "../controllers/fileController";



const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });// Configure multer as needed

// File upload route
router.post("/upload", upload.single("uploadFile"), uploadFile);

export default router;