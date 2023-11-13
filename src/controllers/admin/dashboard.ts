import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import fs from "fs";
import EmployeeModel from "../../models/employee";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export const getAllEmployees = async (req: Request, res: Response) => {
  try {
    const employees = await EmployeeModel.find({}, "-password, -role").exec();
    res
      .status(200)
      .json({ message: "Employees Fetched Successfully", employees });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getEmployee = async (req: Request, res: Response) => {
  try {
    if (!req.params || !req.params.id) throw new Error("Invalid ID");
    const employee = await EmployeeModel.findById(
      { _id: req.params.id },
      "-password, -role"
    ).exec();
    if (!employee) return res.status(404).send("No Employee Found");
    res.status(200).json({ message: "Successful", employee });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error Occured" });
  }
};

export const createEmployee = async (req: Request, res: Response) => {
  const { firstName, lastName, email, bankInfo } = req.body;
  try {
    let existingUser;
    existingUser = await EmployeeModel.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use!" });
    } else {
      const hashPassword = await bcrypt.hash(lastName, 10);
      const newEmployee = new EmployeeModel({
        firstName,
        lastName,
        password: hashPassword,
        bankInfo,
        email
      });
      await newEmployee.save();
      const emailTemplate = fs.readFileSync(
        "../../helpers/mails/welcomeAdminMail.html",
        "utf-8"
      );
      const emailContent = emailTemplate
        .replace("${firstName}", firstName)
        .replace("${lastName}", lastName);
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
        subject: "Account Created!",
        html: emailContent,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error.message);
          res.status(200).json({
            message: "Account created and email not sent to employee",
          });
        } else {
          console.log(`Message sent successfully`);
          res.status(200).json({
            message: "Account created and email sent successfully to employee",
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating employee" });
  }
};

export const deleteEmployee = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await EmployeeModel.deleteOne({ _id: id });
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting employee" });
  }
};

