// import { Request, Response } from "express";
// import FileModel, { IFile } from "../models/fileModel";

// //upload file to the database
// export const uploadFile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     if(!req.file) {
//       res.status(400).send("No file uploaded");
//     }

//     const newFile: IFile = new FileModel({
//       filename: req.file?.originalname,
//       data: req.file?.buffer,
//       contentType: req.file?.mimetype,
//     })

//     await newFile.save();
//     res.status(201).send(`File uploaded successfully ${req.file?.originalname}`);
//   }
//   catch (error) {
//     res.status(500).send("Error uploading file: " + error);
//   }
// }

// //Download File From db
// export const downloadFile = async (req: Request, res: Response): Promise<void> => {
//   try {
//     const filename = req.params.filename;
//     const file = await FileModel.findOne({filename});

//     if(!file) {
//       res.status(404).send("File not found.");
//       return;
//     }

//     res.set("Content-Type", file.contentType);
//     res.send(file.data);
//   }
//   catch (error) {
//     res.status(500).send("Error downloading file: " + error);
//   }
// }
