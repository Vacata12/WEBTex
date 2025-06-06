"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __importDefault(require("./connection"));
const userModel_1 = __importDefault(require("../models/userModel"));
const storageQuotaModel_1 = __importDefault(require("../models/storageQuotaModel"));
const fileModel_1 = __importDefault(require("../models/fileModel"));
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../config/db"));
const initializeDatabase = async () => {
    try {
        await (0, connection_1.default)();
        console.log('Connected to MongoDB');
        const userCount = await userModel_1.default.countDocuments();
        if (userCount > 0) {
            console.log(`Database already contains ${userCount} users. Skipping initialization.`);
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash('admin123', 10);
        const adminUser = new userModel_1.default({
            firstName: 'Admin',
            lastName: 'User',
            username: 'admin',
            email: 'admin@example.com',
            password: hashedPassword,
            isVerified: true
        });
        const savedUser = await adminUser.save();
        console.log('Created default admin user');
        const adminQuota = new storageQuotaModel_1.default({
            userId: savedUser._id,
            totalSpace: db_1.default.storageQuotas.business,
            usedSpace: 0,
            plan: 'business'
        });
        await adminQuota.save();
        console.log('Created default admin storage quota');
        const rootDir = new fileModel_1.default({
            name: 'root',
            type: 'directory',
            path: '/',
            owner: savedUser._id,
            parent: null,
            isPublic: false,
            originalName: 'root'
        });
        await rootDir.save();
        console.log('Created root directory for admin user');
        console.log('Database initialization completed successfully');
    }
    catch (error) {
        console.error('Database initialization failed:', error);
    }
    finally {
        await mongoose_1.default.connection.close();
        console.log('Database connection closed');
    }
};
if (require.main === module) {
    initializeDatabase();
}
exports.default = initializeDatabase;
