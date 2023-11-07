import express from "express";
import connectDB from "./config/database";
const app = express();
const port = 3000;
import adminRouter from "./routes/admin";

connectDB();
app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.use("/admin", adminRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
