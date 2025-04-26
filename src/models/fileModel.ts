import mongoose, { Schema, Document } from "mongoose";

interface IFile extends Document {
    name: string;
    type: string; // 'file' or 'directory'
    path: string;
    content?: string; // Optional content for files
    mimeType?: string; // For files only
    size?: number; // Size in bytes for files
    owner: mongoose.Types.ObjectId;
    parent?: mongoose.Types.ObjectId; // Parent directory, null for root items
    isPublic: boolean;
    lastModified: Date;
    originalName: string; // Original filename before upload
    storageUrl?: string; // URL or path in storage system
    sharedWith: mongoose.Types.ObjectId[]; // Users with whom file is shared
    starred: boolean; // For favorite files
}

const FileSchema: Schema = new Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['file', 'directory']
    },
    path: {
        type: String,
        required: true
    },
    content: {
        type: String,
        default: null
    },
    mimeType: {
        type: String,
        default: null
    },
    size: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'File',
        default: null
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    lastModified: {
        type: Date,
        default: Date.now
    },
    originalName: {
        type: String,
        required: true
    },
    storageUrl: {
        type: String,
        default: null
    },
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    starred: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index for faster queries
FileSchema.index({ owner: 1, path: 1 }, { unique: true });
FileSchema.index({ parent: 1 });
FileSchema.index({ owner: 1 });
FileSchema.index({ sharedWith: 1 });
FileSchema.index({ starred: 1 });

export default mongoose.model<IFile>('File', FileSchema);