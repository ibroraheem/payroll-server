import mongoose from "mongoose";

const DB_URI: string = "mongodb://localhost:27017/your_database_name";

export default function connectDB() {
  mongoose.connect(DB_URI);

  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB");
  });
}
