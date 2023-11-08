"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const crypto_1 = __importDefault(require("crypto"));
const admin_1 = __importDefault(require("../../models/admin"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, username, password } = req.body;
    try {
        if (!username || !password || !email) {
            return res.status(400).send({ error: "All fields are required" });
        }
        const existingUser = yield admin_1.default.findOne({ email });
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
        const token = jsonwebtoken_1.default.sign({ _id: email }, process.env.SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({
            message: "New admin created",
            token,
            username: username,
            email: email,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        let admin = yield admin_1.default.findOne({ email });
        if (!admin) {
            return res.status(400).send("Invalid Email or Password");
        }
        const validPass = bcryptjs_1.default.compareSync(password, admin.password);
        if (!validPass) {
            return res.status(400).send("Invalid Email or Password");
        }
        const token = jsonwebtoken_1.default.sign({ _id: admin.email }, process.env.SECRET, {
            expiresIn: "1h",
        });
        res.status(200).json({
            message: "Admin logged in successfully",
            token,
            email: admin.email,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).json("server error");
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json;
        }
        const user = yield admin_1.default.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Email not found!" });
        }
        const resetToken = crypto_1.default.randomBytes(32).toString("hex");
        const now = Date.now() + 60 * 60 * 1000;
        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        yield admin_1.default.updateOne({ email }, { $set: { resetToken, resetTokenExpiry: now } });
        const emailTemplate = fs_1.default.readFileSync("../../helpers/mails/resetMail.html", "utf-8");
        const emailContent = emailTemplate.replace("{resetLink}", resetURL);
        const transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD,
            },
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Reset your password",
            html: emailContent,
        };
        try {
            const info = yield transporter.sendMail(mailOptions);
            console.log("Email sent: " + info.response);
            res.status(200).json({ message: "Reset Email Sent to user email" });
        }
        catch (error) {
            console.error("Error sending email: " + error);
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send("server error");
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, token } = req.body;
    try {
        const admin = yield admin_1.default.findOne({ resetToken: token });
        if (!admin) {
            throw new Error("User Not Found");
        }
        if (Date.now() > admin.resetTokenExpiry)
            throw new Error("token expired");
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        admin.password = hashedPassword;
        admin.resetToken = " ";
        admin.resetTokenExpiry = 0;
        yield admin.save();
        return res.status(200).json({ message: "Password Updated Successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.resetPassword = resetPassword;
