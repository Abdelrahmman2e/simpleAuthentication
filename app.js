const express = require("express");
const morgan = require("morgan");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const path = require("path");
const cors = require("cors");

require("dotenv").config({ path: "./config.env" });
const dbConnection = require("./config/dbConnection");
const authRouter = require("./routes/Auth");
const profileRouter = require("./routes/Profile");
const AppError = require("./utils/AppError");
const globalError = require("./middleware/errorHandlerMW");
require("./utils/passportSetup");

// Initialize DB and app
dbConnection();
const app = express();

// CORS for local dev and Vercel preview/prod; allow credentials
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      /https?:\/\/[a-z0-9-]+-.*-vercel\.app$/,
    ],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "SecretKeyq@",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.render("index");
});

app.use("/auth", authRouter);
app.use("/profile", profileRouter);

app.use((req, res, nxt) => {
  return nxt(new AppError(`Can not find this route: ${req.originalUrl}`, 404));
});

app.use(globalError);

module.exports = app;
