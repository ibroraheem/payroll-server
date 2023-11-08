import AdminModel from "../models/admin";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

export const authorizeAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token not provided" });
    }
    let admin = await AdminModel.findOne({ access_token: token });
    if (!admin) {
      throw new Error("Invalid Token");
    } else {
      // @ts-ignore
      req.user = admin;
      next();
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ message: "Internal Server error" });
  }
};
