import mongoose, { Schema, Document } from "mongoose";

interface IStorageQuota extends Document {
    userId: mongoose.Types.ObjectId;
    totalSpace: number;
    usedSpace: number; 
    plan: string;
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
        default: 15 * 1024 * 1024 * 1024
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

StorageQuotaSchema.index({ userId: 1 });
StorageQuotaSchema.index({ plan: 1 });

export default mongoose.model<IStorageQuota>('StorageQuota', StorageQuotaSchema);
