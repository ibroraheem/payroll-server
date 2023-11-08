import mongoose, { Document, Schema } from "mongoose";

interface Employee {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

const employeeSchema = new Schema<Employee & Document>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, default: "employee" },
});

const EmployeeModel = mongoose.model<Employee & Document>(
  "Employee",
  employeeSchema
);

export default EmployeeModel;
