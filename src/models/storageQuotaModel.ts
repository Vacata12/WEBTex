import mongoose, { Schema, Document } from "mongoose";
import dbConfig from '../config/db';

interface IStorageQuota extends Document {
    userId: mongoose.Types.ObjectId;
    totalSpace: number; // Total allocated space in bytes
    usedSpace: number; // Used space in bytes
    plan: string; // e.g., 'free', 'premium', 'business'
}

const StorageQuotaSchema: Schema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    totalSpace: {
        type: Number,
        required: true,
        default: dbConfig.storageQuotas.free // Default from config
    },
    usedSpace: {
        type: Number,
        required: true,
        default: 0
    },
    plan: {
        type: String,
        enum: ['free', 'premium', 'business'],
        default: 'free'
    }
}, {
    timestamps: true
});

// Add index for quick lookups
StorageQuotaSchema.index({ userId: 1 });
StorageQuotaSchema.index({ plan: 1 });

export default mongoose.model<IStorageQuota>('StorageQuota', StorageQuotaSchema);
