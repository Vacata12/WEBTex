"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// vite.config.ts
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
exports.default = (0, vite_1.defineConfig)({
    root: "src", // там ти е main.tsx и App.tsx
    publicDir: "../public", // ако имаш public assets
    plugins: [(0, plugin_react_1.default)()],
    build: {
        outDir: "../dist", // къде да слага резултата при build
        emptyOutDir: true
    },
    server: {
        port: 3000 // фронтендът ще тръгне на http://localhost:3000
    }
});
