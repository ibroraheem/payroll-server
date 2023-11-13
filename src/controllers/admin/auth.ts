import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import fs from "fs";
import crypto from "crypto";
import AdminModel from "../../models/admin";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

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
    res.status(200).json({
      message: "New admin created",
      token,
      username: username,
      email: email,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
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
    res.status(500).json("server error");
  }
};

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;
  try {
    if (!email) {
      return res.status(400).json;
    }
    const user = await AdminModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email not found!" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    const now = Date.now() + 60 * 60 * 1000;
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await AdminModel.updateOne(
      { email },
      { $set: { resetToken, resetTokenExpiry: now } }
    );
    const emailTemplate = fs.readFileSync(
      "../../helpers/mails/resetMail.html",
      "utf-8"
    );
    const emailContent = emailTemplate.replace("{resetLink}", resetURL);
    const transporter = nodemailer.createTransport({
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
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent: " + info.response);
      res.status(200).json({ message: "Reset Email Sent to user email" });
    } catch (error) {
      console.error("Error sending email: " + error);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("server error");
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { password, token } = req.body;
  try {
    const admin = await AdminModel.findOne({ resetToken: token });
    if (!admin) {
      throw new Error("User Not Found");
    }
    if (Date.now() > admin.resetTokenExpiry) throw new Error("token expired");
    const hashedPassword = await bcrypt.hash(password, 12);
    admin.password = hashedPassword;
    admin.resetToken = " ";
    admin.resetTokenExpiry = 0;
    await admin.save();
    return res.status(200).json({ message: "Password Updated Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

