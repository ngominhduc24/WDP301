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
// const allowedOrigins = [CLIENT_URL, "http://rms.io.vn"];
const allowedOrigins = [CLIENT_URL, "http://localhost:5000", "*", "http://ngominhduc24.ddns.net", "http://ngominhduc24.ddns.net:5000"];

// CORS middleware configurations
const corsOptions = {
  origin: true, // Allow requests from all origins
  credentials: true, // allow sending cookies from the client
};

// Apply CORS middleware to your Express application
app.use(cors(corsOptions));
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );

//   if (req.method === "OPTIONS") {
//     res.sendStatus(200);
//   } else {
//     next();
//   }
// });
app.use(cookieParser());
app.use(json());
app.use(urlencoded({ extended: true }));
cloudinary.config({
  cloud_name: "dtpujfoo8",
  api_key: "697855136624351",
  api_secret: "gYkgLXmSaCiVhCM40clYpA_dFr8",
});
app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "admin",
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
  cb(null, user);
});
passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

app.get("/", (req, res) => {
  res.send("API is working");
});

app.use("/api/v1", indexRouter);

const startServer = async () => {
  try {
    await connect(MONGODB_URL);
    console.log(">>> Connected to MongoDB");
    const server = app.listen(SERVER_PORT || 5000, () => {
      console.log(`>>> Listening on port ${SERVER_PORT || 5000}`);
    });
    socketConnect(server);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};

startServer();
