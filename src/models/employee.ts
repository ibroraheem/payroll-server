import mongoose, { Document, Schema } from "mongoose";

interface Employee {
  name: string;
  email: string;
  password: string;
  otp: string;
  otpExpires: number;
  role: string;
  bankInfo: {
    accountName: string;
    accountNumber: string;
    bankName: string;
  };
  salaryInfo: {
    salaryAmount: number;
    monthlyBonus: number;
    totalReceived: number;
  };
}

const employeeSchema = new Schema<Employee & Document>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, required: true },
  otpExpires: { type: Number, required: true },
  role: { type: String, required: true, default: "employee" },
  bankInfo: {
    accountName: { type: String, default: "" },
    accountNumber: { type: String, default: "" },
    bankName: { type: String, required: true },
  },
  salaryInfo: {
    salaryAmount: { type: Number, required: true },
    monthlyBonus: { type: Number, required: true, default: 0 },
    totalReceived: { type: Number, required: true },
  },
});

employeeSchema.pre("save", function (next) {
  // @ts-ignore
  this.salaryInfo.totalReceived = this.salaryInfo.monthlyBonus + this.salaryInfo.salaryAmount;
  next();
});

const EmployeeModel = mongoose.model<Employee & Document>("Employee", employeeSchema);

export default EmployeeModel;
