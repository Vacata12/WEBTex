"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const fileController_1 = require("../controllers/fileController");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() }); // Configure multer as needed
// File upload route
router.post("/upload", upload.single("uploadFile"), fileController_1.uploadFile);
//File download route
router.get("/download/:id", fileController_1.downloadFile);
//File delete route
router.get("/delete/:id", fileController_1.deleteFile);
exports.default = router;
