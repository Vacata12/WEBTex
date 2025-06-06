"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFile = exports.downloadFile = exports.uploadFile = void 0;
const fileModel_1 = __importDefault(require("../models/fileModel"));
const mongoose_1 = __importDefault(require("mongoose"));
//upload file
const uploadFile = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).send("No file uploaded");
        }
        const { originalname, mimetype, size, buffer } = req.file;
        const newFile = new fileModel_1.default({
            name: req.body.name || originalname,
            type: "file",
            path: '/',
            content: buffer.toString('base64'),
            mimeType: mimetype,
            size: size,
            owner: new mongoose_1.default.Types.ObjectId("645b9c8f4f509b0012345678"),
            parent: new mongoose_1.default.Types.ObjectId("645b9c8f4f509b0012345678"),
            isPublic: false,
            lastModified: new Date(),
            originalName: originalname,
            sharedWith: req.body.sharedWith || [],
            starred: req.body.starred || false
        });
        await newFile.save();
        res.status(201).send({ message: "File uploaded successfully", file: newFile });
    }
    catch (error) {
        res.status(500).send("Error uploading file: " + error);
    }
};
exports.uploadFile = uploadFile;
//Download File From db
const downloadFile = async (req, res) => {
    try {
        const { id } = req.params;
        const file = await fileModel_1.default.findById(id);
        if (!file) {
            res.status(404).send("File not found!");
            return;
        }
        const fileBuffer = Buffer.from(file.content || "", "base64");
        // Handle special symbols in the name
        const encodedFileName = encodeURIComponent(file.originalName);
        console.log(encodedFileName);
        res.setHeader("Content-Type", file.mimeType || "application/octet-stream");
        res.setHeader("Content-Disposition", `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`);
        res.setHeader("Content-Length", file.size?.toString() || "0");
        res.end(fileBuffer); // send raw binary 
    }
    catch (error) {
        res.status(500).send("Error downloading file: " + error);
    }
};
exports.downloadFile = downloadFile;
//Delete File from db
const deleteFile = async (req, res) => {
    try {
        const { id } = req.params;
        const deleteFile = await fileModel_1.default.findByIdAndRemove(id);
        if (!deleteFile) {
            res.status(404).send("File not found!");
            return;
        }
        res.status(200).send({ message: "File deleted successfully", file: deleteFile });
    }
    catch (error) {
        res.status(500).send("Error deleting file: " + error);
    }
};
exports.deleteFile = deleteFile;
