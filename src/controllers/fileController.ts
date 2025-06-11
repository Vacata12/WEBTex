import { Request, Response } from "express";
import fileModel, { IFile } from "../models/fileModel.js";
import mongoose from "mongoose";

declare global {
    namespace Express {
        interface User {
            _id: mongoose.Types.ObjectId | string;
        }
        
        interface Request {
            user?: User;
            file?: Express.Multer.File;
        }
    }
}



export const uploadFile = async (req: Request, res: Response): Promise<void> => {
    try {
        if(!req.file) {
            res.status(400).send("No file uploaded");
            return;
        }

        const userId = req.user?._id;
        
        if (!userId) {
            res.status(401).send("User not authenticated");
            return;
        }

        const { originalname, mimetype, size, buffer } = req.file as Express.Multer.File;


        const uniquePath = `/${req.body.parent || 'root'}/${originalname}`;

        const existingFile = await fileModel.findOne({
            owner: new mongoose.Types.ObjectId(userId),
            path: uniquePath,
            name: originalname
        });

        if (existingFile) {
            existingFile.content = buffer.toString('base64');
            existingFile.size = size;
            existingFile.mimeType = mimetype;
            existingFile.lastModified = new Date();
            
            await existingFile.save();
            res.status(200).send({ 
                message: "File updated successfully", 
                file: existingFile 
            });
            return;
        }

        const newFile = new fileModel({
            name: originalname,
            type: "file",
            path: uniquePath,
            content: buffer.toString('base64'),
            mimeType: mimetype,
            size: size,
            owner: new mongoose.Types.ObjectId(userId),
            parent: req.body.parent || null,
            isPublic: false,
            lastModified: new Date(),
            originalName: originalname,
            sharedWith: req.body.sharedWith || [],
            starred: req.body.starred || false
        });

        await newFile.save();
        res.status(201).send({ 
            message: "File uploaded successfully", 
            file: newFile 
        });
    }
    catch(error) {
        console.error('Upload error:', error);
        res.status(500).send("Error uploading file: " + error);
    }
}



export const downloadFile = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const file = await fileModel.findById(id);

        if (!file) {
            res.status(404).send("File not found!");
            return;
        }

        const fileBuffer = Buffer.from(file.content || "", "base64");


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
        const userId = req.user?._id;

        if (!userId) {
            res.status(401).send("User not authenticated");
            return;
        }

        const file = await fileModel.findOne({
            _id: id,
            owner: userId
        });

        if (!file) {
            res.status(404).send("File not found or you don't have permission to delete it");
            return;
        }

        await fileModel.findByIdAndDelete(id);
        res.status(200).json({ 
            message: "File deleted successfully", 
            fileId: id 
        });
    }
    catch(error) {
        console.error('Delete error:', error);
        res.status(500).send("Error deleting file: " + error);  
    }
}

//upload directory in work
export const createDirectory = async(req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?._id;
        
        if (!userId) {
            res.status(401).send("User not authenticated");
            return;
        }

        const { name, parent } = req.body;

        if (!name) {
            res.status(400).send("Directory name is required");
            return;
        }

        // Generate a unique path
        const uniquePath = `/${parent || 'root'}/${name}`;

        // Check if directory already exists
        const existingDir = await fileModel.findOne({
            owner: new mongoose.Types.ObjectId(userId),
            path: uniquePath,
            name: name,
            type: 'directory'
        });

        if (existingDir) {
            res.status(409).send("Directory already exists");
            return;
        }

        const newDirectory = new fileModel({
            name: name,
            type: "directory",
            path: uniquePath,
            size: 0,
            owner: new mongoose.Types.ObjectId(userId),
            parent: parent || null,
            isPublic: false,
            lastModified: new Date(),
            originalName: name,
            sharedWith: [],
            starred: false
        });

        await newDirectory.save();
        res.status(201).json({ 
            message: "Directory created successfully", 
            directory: newDirectory 
        });
    }
    catch (error) {
        console.error('Create directory error:', error);
        res.status(500).send("Error creating directory: " + error);  
    }
}

export const showDataInDirectory = async(req: Request, res: Response): Promise<void> => {
    try {
        const { directoryId } = req.params;

        const userId = req.session?.user?.id;
        
        if (!userId) {
            res.status(401).send("User not authenticated");
            return;
        }

        const query = directoryId ? {
            parent: new mongoose.Types.ObjectId(directoryId),
            $or: [
                {owner: new mongoose.Types.ObjectId(userId)},
                {sharedWith: new mongoose.Types.ObjectId(userId)},
                {isPublic: true}
            ]
        } : {
            parent: null,
            $or: [
                {owner: new mongoose.Types.ObjectId(userId)},
                {sharedWith: new mongoose.Types.ObjectId(userId)},
                {isPublic: true}
            ]
        };

        const files = await fileModel
            .find(query)
            .select("name type size lastModified isPublic starred originalName")
            .sort({type: -1, name: 1});
        
        res.status(200).json({
            message: files.length ? "Files retrieved successfully" : "Directory is empty",
            currentDirectory: directoryId || "root",
            items: files
        });
    }
    catch (error) {
        console.error('Directory error:', error);
        res.status(500).send("Error retrieving directory contents: " + error);
    }
}

function getFileCategory(mimeType: string): string {
    const viewableTypes = [
        "image/jpeg", "image/png", "image/gif", "image/webp",
        "application/pdf",
        "video/mp4", "video/webm",
        "audio/mpeg", "audio/wav", "audio/webm"
    ]

    const textTypes = [
        "text/plain", "text/html", "text/css", "text/javascript",
        "application/json", "application/xml", "text/markdown",
        "application/javascript", "text/csv"
    ];

    if (viewableTypes.includes(mimeType)) return "viewable";
    if (textTypes.includes(mimeType)) return 'text';
    return 'binary';
}

export const previewFile = async(req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const file = await fileModel.findById(id);

        if (!file) {
            res.status(404).send("File not found!");
            return;
        }

        const fileBuffer = Buffer.from(file.content || "", "base64");
        const fileCategory = getFileCategory(file.mimeType || "");

        switch (fileCategory) {
            case 'viewable':
                // For files that can be viewed directly in browser (images, PDFs, text)
                if (file.mimeType) {
                    res.setHeader('Content-Type', file.mimeType);
                }
                res.setHeader('Content-Disposition', 'inline');
                res.send(fileBuffer);
                break;

            case 'text':
                // For text-based files that can be displayed as plain text
                try {
                    const textContent = fileBuffer.toString('utf-8');
                    res.status(200).json({
                        message: "File content retrieved successfully",
                        content: textContent,
                        type: "text"
                    });
                } catch (error) {
                    res.status(400).send("Error reading text content");
                }
                break;

            case 'binary':
                // For files that need to be downloaded
                res.status(200).json({
                    message: "File is binary, use download endpoint",
                    type: file.mimeType,
                    size: file.size,
                    downloadUrl: `/api/files/download/${file._id}`
                });
                break;

            default:
                res.status(400).json({
                    message: "Unknown file type",
                    type: file.mimeType
                });
        }
    } catch (error) {
        console.error('Error in previewFile:', error);
        res.status(500).send("Error retrieving file content");
    }
}

export const getDirectoryPath = async(req: Request, res: Response): Promise<void> => {
    try {
        const { directoryId } = req.params;
        const userId = req.user?._id;
        
        if (!userId || !directoryId) {
            res.status(401).send("User not authenticated or invalid directory");
            return;
        }

        let currentDir = await fileModel.findOne({
            _id: directoryId,
            owner: userId
        });
        
        const path: Array<{ _id: any; name: string }> = [];
        
        while (currentDir && currentDir.parent) {
            path.unshift({
                _id: currentDir._id,
                name: currentDir.name
            });
            
            currentDir = await fileModel.findOne({
                _id: currentDir.parent,
                owner: userId
            });
        }
        
        res.status(200).json(path);
    } catch (error) {
        console.error('Path error:', error);
        res.status(500).send("Error retrieving directory path: " + error);
    }
};