import mongoose from "mongoose";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
const session = require("express-session");
import cors from "cors";
import AuthRoute from "./routes/AuthRoute.js";
import UserRoute from "./routes/UserRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";
import BlogRoute from "./routes/BlogRoute.js";
import CommentRoute from "./routes/CommentRoute.js";
import LikeRoute from "./routes/LikeRoute.js";
dotenv.config();
const PORT = process.env.PORT || 3000;

const app = express();

const sessionConfig = {
  secret: "MYSECRET",
  name: "appName",
  resave: false,
  saveUninitialized: false,
  store: store,
  cookie: {
    sameSite: "strict", 
  },
};

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1); 
  sessionConfig.cookie.secure = true; 
}

app.use(session(sessionConfig));
// Middleware
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Connection to database failed. ", error);
  });

app.use("/api/auth", AuthRoute);
app.use("/api/user", UserRoute);
app.use("/api/category", CategoryRoute);
app.use("/api/blog", BlogRoute);
app.use("/api/comment", CommentRoute);
app.use("/api/like", LikeRoute);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

app.get("/", (req, res) => {
  res.send("Api Works");
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
