import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();



export default function connectDB() {
  mongoose.connect(process.env.DB_URI as string);

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB");
  });
}
