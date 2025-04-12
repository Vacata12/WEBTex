import express, { Request, Response, NextFunction } from "express";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;
const uploadDir = path.resolve(__dirname, "uploads");

// File upload response
app.post("/api/upload", (req: Request, res: Response) => {
  res.send("File uploaded successfully");
});

// Download file API (local)
app.get("/api/download/:filename", (req: Request, res: Response, next: NextFunction) => {
  const filename: string = req.params.filename;
  const filePath: string = path.join(uploadDir, filename);

  res.download(filePath, filename, (err: Error | null) => {
    if (err) {
      res.status(500).send({
        error: err,
        message: "File not downloaded. " + err.message,
      });
    }
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});