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
exports.deleteEmployee = exports.createEmployee = exports.getEmployee = exports.getAllEmployees = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const fs_1 = __importDefault(require("fs"));
const employee_1 = __importDefault(require("../../models/employee"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const getAllEmployees = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employees = yield employee_1.default.find({}, "-password, -role").exec();
        res
            .status(200)
            .json({ message: "Employees Fetched Successfully", employees });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.getAllEmployees = getAllEmployees;
const getEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.params || !req.params.id)
            throw new Error("Invalid ID");
        const employee = yield employee_1.default.findById({ _id: req.params.id }, "-password, -role").exec();
        if (!employee)
            return res.status(404).send("No Employee Found");
        res.status(200).json({ message: "Successful", employee });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error Occured" });
    }
});
exports.getEmployee = getEmployee;
const createEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, bankInfo } = req.body;
    try {
        let existingUser;
        existingUser = yield employee_1.default.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "Email already in use!" });
        }
        else {
            const hashPassword = yield bcryptjs_1.default.hash(lastName, 10);
            const newEmployee = new employee_1.default({
                firstName,
                lastName,
                password: hashPassword,
                bankInfo,
                email
            });
            yield newEmployee.save();
            const emailTemplate = fs_1.default.readFileSync("../../helpers/mails/welcomeAdminMail.html", "utf-8");
            const emailContent = emailTemplate
                .replace("${firstName}", firstName)
                .replace("${lastName}", lastName);
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
                subject: "Account Created!",
                html: emailContent,
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.log(error.message);
                    res.status(200).json({
                        message: "Account created and email not sent to employee",
                    });
                }
                else {
                    console.log(`Message sent successfully`);
                    res.status(200).json({
                        message: "Account created and email sent successfully to employee",
                    });
                }
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating employee" });
    }
});
exports.createEmployee = createEmployee;
const deleteEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        yield employee_1.default.deleteOne({ _id: id });
        res.status(200).json({ message: "Deleted Successfully" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting employee" });
    }
});
exports.deleteEmployee = deleteEmployee;
