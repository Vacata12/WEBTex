"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const serverApp_1 = __importDefault(require("./serverApp"));
const connection_1 = __importDefault(require("./db/connection"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
// Connect to the database
(0, connection_1.default)()
    .then(() => {
    console.log("Database connected successfully");
    // Start the server only after the database is connected
    serverApp_1.default.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error("Failed to connect to database:", err);
    process.exit(1);
});
