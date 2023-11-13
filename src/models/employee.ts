import mongoose, { Document, Schema } from "mongoose";

interface Employee {
  name: string;
  email: string;
  password: string;
  otp:string;
  otpExpires: number;
  role: string;
  bankInfo: object;
}

const employeeSchema = new Schema<Employee & Document>({
  name: { type: "string", required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bankInfo: {
    accountName: {
      type: String,
      default: "",

    },
    accountNumber: {
      type: String,
      default: "",

    },
    bankName: { type: String, required: true }
  },
  role: { type: String, required: true, default: "employee" },
});

const EmployeeModel = mongoose.model<Employee & Document>(
  "Employee",
  employeeSchema
);

export default EmployeeModel;
