"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRouter = express_1.default.Router();
const auth_1 = require("../controllers/admin/auth");
adminRouter.post("/register", auth_1.register);
adminRouter.post("/login", auth_1.login);
adminRouter.get("/forgot-password/", auth_1.forgotPassword);
adminRouter.put("/reset-password/", auth_1.resetPassword);
exports.default = adminRouter;
