import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import fs from "fs";
import crypto from "crypto";
import EmployeeModel from "../../models/employee";
import { Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

export const register = async (req: Request, res: Response) => {
    const { email, name, password, phoneNumber, homeAddress } = req.body
    try {
        if (!name || !password || !phoneNumber) {
            return res.status(401).send({ message: "Please fill all fields" })
        } else {
            let employeeExist = await EmployeeModel.findOne({ email })
            if (employeeExist) {
                return res.status(409).send({ message: 'Email already exist' });
            } else {
                const hashPassword = await bcrypt.hash(password, 10);

                const employee = new EmployeeModel({
                    email,
                    name,
                    password: hashPassword,
                    phoneNumber,
                    homeAddress
                })
                await employee.save()

            }
        }
    } catch (error) {
        console.log('Error in Register', error)
        return res.status(500).send({ message: 'Internal Server Error' })
    }
}

