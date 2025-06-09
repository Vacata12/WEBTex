import express from "express";
import multer from "multer";
import { uploadFile, downloadFile, deleteFile, showDataInDirectory, previewFile, createDirectory, getDirectoryPath } from "../controllers/fileController.js";
import { isAuthenticated } from "../middlewares/errorHandler.js";
import fileModel from "../models/fileModel.js";

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

router.get("/all", async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            return res.status(401).send("User not authenticated");
        }

        const files = await fileModel.find({
            $or: [
                { owner: userId },
                { sharedWith: userId },
                { isPublic: true }
            ]
        }).select("name type path size lastModified");

        res.json({ items: files });
    } catch (error) {
        console.error('Error fetching all files:', error);
        res.status(500).send("Error fetching files");
    }
});

export default router;