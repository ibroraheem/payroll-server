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
exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const employee_1 = __importDefault(require("../../models/employee"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, name, password, phoneNumber, homeAddress } = req.body;
    try {
        if (!name || !password || !phoneNumber) {
            return res.status(401).send({ message: "Please fill all fields" });
        }
        else {
            let employeeExist = yield employee_1.default.findOne({ email });
            if (employeeExist) {
                return res.status(409).send({ message: 'Email already exist' });
            }
            else {
                const hashPassword = yield bcryptjs_1.default.hash(password, 10);
                const employee = new employee_1.default({
                    email,
                    name,
                    password: hashPassword,
                    phoneNumber,
                    homeAddress
                });
                yield employee.save();
            }
        }
    }
    catch (error) {
        console.log('Error in Register', error);
        return res.status(500).send({ message: 'Internal Server Error' });
    }
});
exports.register = register;
