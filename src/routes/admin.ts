import express from "express";
const adminRouter = express.Router();

import {
  register,
  login,
  forgotPassword,
  resetPassword,
} from "../controllers/admin/auth";

adminRouter.post("/register", register);
adminRouter.post("/login", login);
adminRouter.get("/forgot-password/", forgotPassword);
adminRouter.put("/reset-password/", resetPassword);

export default adminRouter;
