import express from "express";
import { config } from "dotenv";
import { connectDB } from "./config/connectDB.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/user.js";
import postRoutes from "./routes/post.js";

config({
  path: "./.env",
});

connectDB();

const app = express();

const PORT = process.env.PORT || 3000;

//cors
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

//cookie parser
app.use(cookieParser());

//parse json data
app.use(express.json());

//apis
app.use("/api/user", userRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
  res.json({ msg: "Welcome to the backend of LinkedIn mini!" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
