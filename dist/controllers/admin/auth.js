"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const admin_1 = __importDefault(require("../../models/admin"));
const register = (req, res) => {
    const { email, username, password } = req.body;
    try {
        if (!username || !password || !email) {
            return res.status(400).send({ error: "All fields are required" });
        }
        const existingUser = admin_1.default.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "user already registered" });
        }
        const hashedPassword = bcryptjs_1.default.hashSync(password, 12);
        const newAdmin = new admin_1.default({
            username,
            email,
            password: hashedPassword,
        });
        newAdmin.save();
        res.status(200).send("New admin created");
    }
    catch (error) {
        console.log(error);
        res.status(500).send("Server Error");
    }
};
exports.register = register;
