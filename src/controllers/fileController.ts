import { Request, Response } from "express";
import fileModel from "../models/fileModel";
import mongoose from "mongoose";
import IFile from "../models/fileModel";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}


//upload file to db
export const uploadFile = async (req: Request, res: Response): Promise<void> => {
    try {
        if(!req.file) {
            res.status(400).send("No file uploaded");
        }

        const { originalname, mimetype, size, buffer } = req.file as Express.Multer.File;

        const newFile = new fileModel({
            name: req.body.name || originalname,
            type: "file",
            path: '/',
            content: buffer.toString('base64'),
            mimeType: mimetype,
            size: size,
            owner: new mongoose.Types.ObjectId("645b9c8f4f509b0012345678"),
            parent: new mongoose.Types.ObjectId("645b9c8f4f509b0012345678"),
            isPublic: false,
            lastModified: new Date(),
            originalName: originalname,
            sharedWith: req.body.sharedWith || [],
            starred: req.body.starred || false
        });

        await newFile.save();
        res.status(201).send({ message: "File uploaded successfully", file: newFile });
    }
    catch(error) {
        res.status(500).send("Error uploading file: " + error);
    }
}


//Download File From db
export const downloadFile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const file = await fileModel.findById(id);

        if (!file) {
            res.status(404).send("File not found!");
            return;
        }

        const fileBuffer = Buffer.from(file.content || "", "base64");

        // Handle special symbols in the name
        const encodedFileName = encodeURIComponent(file.originalName);
        console.log(encodedFileName)

        res.setHeader("Content-Type", file.mimeType || "application/octet-stream");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${encodedFileName}"; filename*=UTF-8''${encodedFileName}`
        );
        res.setHeader("Content-Length", file.size?.toString() || "0");

        res.end(fileBuffer); // send raw binary 
    } catch (error) {
        res.status(500).send("Error downloading file: " + error);
    }
};

//Delete File from db
export const deleteFile = async(req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const deleteFile = await fileModel.findByIdAndRemove(id);

        if (!deleteFile) {
            res.status(404).send("File not found!");
            return;
        }

        res.status(200).send({ message: "File deleted successfully", file: deleteFile });
    }
    catch(error) {
        res.status(500).send("Error deleting file: " + error);  
    }
}

//upload directory in work
export const createDirectory = async(req: Request, res: Response): Promise<void> => {
    try {
        const { originalname, mimetype, size, buffer } = req.file as Express.Multer.File;

        const newFile = new fileModel({
            name: req.body.name || originalname,
            type: "directory",
            path: '/',
            content: buffer.toString('base64'),
            mimeType: mimetype,
            size: size,
            owner: new mongoose.Types.ObjectId("645b9c8f4f509b0012345678"),
            parent: new mongoose.Types.ObjectId("645b9c8f4f509b0012345678"),
            isPublic: false,
            lastModified: new Date(),
            originalName: originalname,
            sharedWith: req.body.sharedWith || [],
            starred: req.body.starred || false
        });
    }
    catch (error) {
        res.status(500).send("Error creating directory: " + error);  
    }
}

export const showDataInDirectory = async(req: Request, res: Response): Promise<void> => {
    
}