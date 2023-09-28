const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { authRouter } = require("./routes/auth");
const session = require("express-session");
const { userRouter } = require("./routes/user");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// CSRF package
const csurf = require("csurf");

const app = express();

// CONFIG
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		cookie: { maxAge: 3 * 60 * 60 * 1000 },
		resave: false,
		saveUninitialized: false,
	})
);
app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// 1- Setup of CSRF package
app.use(csurf({ cookie: true })); // CSRF Package requires Cookies & Session setup

// ROUTES
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(process.env.PORT, () => console.log("Listening"));
