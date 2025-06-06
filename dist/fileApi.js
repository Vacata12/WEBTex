"use strict";
// src/utils/fileApi.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFile = exports.uploadFile = void 0;
const uploadFile = (file) => {
    const formData = new FormData();
    formData.append("uploadFile", file);
    fetch("http://localhost:3000/api/files/upload", {
        method: "POST",
        body: formData,
    })
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((error) => console.error("Error:", error));
};
exports.uploadFile = uploadFile;
const downloadFile = (filename) => {
    fetch(`http://localhost:3000/api/files/download/${filename}`)
        .then((response) => {
        if (!response.ok) {
            throw new Error("File not found");
        }
        return response.blob();
    })
        .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
    })
        .catch((error) => console.error("Error:", error));
};
exports.downloadFile = downloadFile;
