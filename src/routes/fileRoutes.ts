import express from "express";
import multer from "multer";
import { uploadFile, downloadFile, deleteFile } from "../controllers/fileController";



const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });// Configure multer as needed

// File upload route
router.post("/upload", upload.single("uploadFile"), uploadFile);

//File download route
router.get("/download/:id", downloadFile);

//File delete route
router.get("/delete/:id", deleteFile);

export default router;