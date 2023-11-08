import express, { Request, Response, NextFunction } from "express";
const adminRouter = express.Router();
import { authorizeAdmin } from "../middlewares/authorize";

import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/admin/auth";
import {
  getAllEmployees,
  getEmployee,
  deleteEmployee,
  createEmployee,
} from "../controllers/admin/dashboard";

const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  authorizeAdmin(req, res, next);
};

adminRouter.post("/register", register);
adminRouter.post("/login", login);
adminRouter.get("/forgot-password/", forgotPassword);
adminRouter.put("/reset-password/", resetPassword);

adminRouter.use(requireAdminAuth);

adminRouter.get("/employees", getAllEmployees);
adminRouter.get("/employee/:id", getEmployee);
adminRouter.delete("/employee/:id", deleteEmployee);
adminRouter.post("/create-employee", createEmployee);

export default adminRouter;
