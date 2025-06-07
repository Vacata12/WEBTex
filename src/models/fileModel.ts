import mongoose, { Schema, Document } from "mongoose";

export interface IFile extends Document {
    name: string;
    type: string;
    path: string;
    content?: string;
    mimeType?: string; 
    size?: number;
    owner: mongoose.Types.ObjectId;
    parent?: mongoose.Types.ObjectId;
    isPublic: boolean;
    lastModified: Date;
    originalName: string; 
    storageUrl?: string; 
    sharedWith: mongoose.Types.ObjectId[];
    starred: boolean; 
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


FileSchema.index({ owner: 1, path: 1 }, { unique: true });
FileSchema.index({ parent: 1 });
FileSchema.index({ owner: 1 });
FileSchema.index({ sharedWith: 1 });
FileSchema.index({ starred: 1 });

export default mongoose.model<IFile>('File', FileSchema);