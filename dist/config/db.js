"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const dbConfig = {
    connectionString: process.env.DB_CONN_STRING || '',
    dbName: process.env.DB_NAME || '',
    webAppName: process.env.DB_WEB_APP || '',
    options: {
        dbName: process.env.DB_NAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
        autoIndex: true,
    },
    storageQuotas: {
        free: 15 * 1024 * 1024 * 1024, // 15GB
        premium: 100 * 1024 * 1024 * 1024, // 100GB
        business: 500 * 1024 * 1024 * 1024 // 500GB
    }
};
if (!dbConfig.connectionString || !dbConfig.dbName) {
    console.error('Database connection string or name is not defined in environment variables');
    process.exit(1);
}
exports.default = dbConfig;
