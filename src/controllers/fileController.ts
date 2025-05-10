import { Request, Response } from "express";
import fileModel from "../models/fileModel";
import mongoose from "mongoose";
import IFile from "../models/fileModel";

interface MulterRequest extends Request {
    file?: Express.Multer.File;
}

//upload file
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
