import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import AdminModel from "../../models/admin";
import { Request, Response } from "express";

export const register = async (req: Request, res: Response) => {
  const { email, username, password } = req.body;
  try {
    if (!username || !password || !email) {
      return res.status(400).send({ error: "All fields are required" });
    }
    const existingUser = await AdminModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "user already registered" });
    }
    const hashedPassword = bcrypt.hashSync(password, 12);
    const newAdmin = new AdminModel({
      username,
      email,
      password: hashedPassword,
    });
    newAdmin.save();
    const token = jwt.sign({ _id: email }, process.env.SECRET as string, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "New admin created", token });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    let admin = await AdminModel.findOne({ email });
    if (!admin) {
      return res.status(400).send("Invalid Email or Password");
    }
    const validPass = bcrypt.compareSync(password, admin.password);
    if (!validPass) {
      return res.status(400).send("Invalid Email or Password");
    }
    const token = jwt.sign({ _id: admin.email }, process.env.SECRET as string, {
      expiresIn: "1h",
    });
    res.status(200).json({
      message: "Admin logged in successfully",
      token,
      email: admin.email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
};
