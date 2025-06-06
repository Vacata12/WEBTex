"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const FileSchema = new mongoose_1.Schema({
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
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parent: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
            type: mongoose_1.default.Schema.Types.ObjectId,
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
exports.default = mongoose_1.default.model('File', FileSchema);
