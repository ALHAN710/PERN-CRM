"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.privateKey = exports.clientEmail = exports.authDomain = exports.storageBucket = exports.projectId = exports.port = exports.environment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.environment = process.env.NODE_ENV;
exports.port = process.env.PORT || 3000;
exports.projectId = process.env.FIREBASE_PROJECT_ID;
exports.storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
exports.authDomain = process.env.FIREBASE_AUTH_DOMAIN;
exports.clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
exports.privateKey = process.env.FIREBASE_PRIVATE_KEY;
//# sourceMappingURL=config.js.map