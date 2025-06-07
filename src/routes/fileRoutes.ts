import express from "express";
import multer from "multer";
import { uploadFile, downloadFile, deleteFile, showDataInDirectory, previewFile } from "../controllers/fileController.js";



const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });// Configure multer as needed

// File upload route
router.post("/upload", upload.single("uploadFile"), uploadFile);

//File download route
router.get("/download/:id", downloadFile);

//File delete route
router.get("/delete/:id", deleteFile);

//Show files
router.get("/directory/:directoryId?", showDataInDirectory);

//Preview file
router.get("/preview/:id", previewFile);

export default router;