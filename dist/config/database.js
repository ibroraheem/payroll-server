"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function connectDB() {
    mongoose_1.default.connect(process.env.DB_URI);
    const db = mongoose_1.default.connection;
    db.on("error", console.error.bind(console, "MongoDB connection error:"));
    db.once("open", () => {
        console.log("Connected to MongoDB");
    });
}
exports.default = connectDB;
