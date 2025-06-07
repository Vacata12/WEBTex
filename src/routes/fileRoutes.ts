import express from "express";
import multer from "multer";
import { uploadFile, downloadFile, deleteFile, showDataInDirectory, previewFile, createDirectory, getDirectoryPath } from "../controllers/fileController.js";
import { isAuthenticated } from "../middlewares/errorHandler.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Apply authentication middleware to all routes
router.use(isAuthenticated);

// Add user data to request before file operations
router.use((req, res, next) => {
    if (req.session?.user) {
        req.user = {
            _id: req.session.user.id
        };
    }
    next();
});

router.post("/upload", upload.single("uploadFile"), uploadFile);
router.get("/download/:id", downloadFile);
router.delete("/delete/:id", deleteFile); // Changed from GET to DELETE
router.get("/directory/:directoryId?", showDataInDirectory);
router.get("/preview/:id", previewFile);
router.post("/directory", createDirectory);
router.get("/path/:directoryId", getDirectoryPath);

export default router;