// filepath: /Users/ivanstoynev/Documents/GitHub/WEBTex/src/app.ts
import express from "express";
import fileRoutes from "./routes/fileRoutes.js";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../dist')));

// Mount file routes
app.use("/api/files", fileRoutes);

export default app;

/*
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
 */