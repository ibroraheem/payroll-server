"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminRouter = express_1.default.Router();
const authorize_1 = require("../middlewares/authorize");
const auth_1 = require("../controllers/admin/auth");
const dashboard_1 = require("../controllers/admin/dashboard");
const requireAdminAuth = (req, res, next) => {
    (0, authorize_1.authorizeAdmin)(req, res, next);
};
adminRouter.post("/register", auth_1.register);
adminRouter.post("/login", auth_1.login);
adminRouter.get("/forgot-password/", auth_1.forgotPassword);
adminRouter.put("/reset-password/", auth_1.resetPassword);
adminRouter.use(requireAdminAuth);
adminRouter.get("/employees", dashboard_1.getAllEmployees);
adminRouter.get("/employee/:id", dashboard_1.getEmployee);
adminRouter.delete("/employee/:id", dashboard_1.deleteEmployee);
adminRouter.post("/create-employee", dashboard_1.createEmployee);
exports.default = adminRouter;
