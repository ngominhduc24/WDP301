import * as dotenv from "dotenv";
dotenv.config();
import express, { json, urlencoded } from "express";
import cors from "cors";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import indexRouter from "./routes/index.route.js";
import { v2 as cloudinary } from "cloudinary";
import socketConnect from "../config/socketIO.js";

const { SERVER_PORT, MONGODB_URL, CLIENT_URL } = process.env;

const app = express();

// List of allowed client URLs (domains) you want to permit
const allowedOrigins = [
  CLIENT_URL,
  "http://rms.io.vn",
  "http://localhost:3000",
];

// CORS middleware configuration
const corsOptions = {
  origin: (origin, callback) => {
    // Kiểm tra nếu origin có trong danh sách allowedOrigins hoặc nếu origin là undefined (trường hợp request từ server-side)
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS")); // Nếu origin không hợp lệ, trả về lỗi
    }
  },
  credentials: true, // Cho phép gửi cookie cùng với request
};

// Apply CORS middleware to your Express application
app.use(cors(corsOptions)); // Đảm bảo cors được cấu hình đúng

// Middleware để tùy chỉnh thêm các header CORS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin); // Set origin hợp lệ vào header
  }
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Credentials", "true"); // Cho phép cookie đi kèm request
  if (req.method === "OPTIONS") {
    return res.sendStatus(200); // Trả về 200 cho các preflight request (OPTIONS)
  }
  next();
});

// Các middleware khác
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dtpujfoo8",
  api_key: "697855136624351",
  api_secret: "gYkgLXmSaCiVhCM40clYpA_dFr8",
});

// Session configuration
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "admin",
    cookie: { secure: false, sameSite: "lax" }, // Sửa lại cấu hình cookie cho đúng nếu cần
  })
);

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

// Default route
app.get("/", (req, res) => {
  res.send("API is working");
});

// Routes for API
app.use("/api/v1", indexRouter);

// Start server and connect to MongoDB
const startServer = async () => {
  try {
    await connect(MONGODB_URL);
    console.log(">>> Connected to MongoDB");
    const server = app.listen(SERVER_PORT || 5000, () => {
      console.log(`>>> Listening on port ${SERVER_PORT || 5000}`);
    });
    socketConnect(server); // Connect to socket server
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

startServer();
