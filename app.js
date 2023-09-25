const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { authRouter } = require("./routes/auth");
const session = require("express-session");
const { userRouter } = require("./routes/user");
require("dotenv").config();

const app = express();

// CONFIG
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.use(session({ secret: process.env.SESSION_SECRET }));

// ROUTES
app.use("/auth", authRouter);
app.use("/user", userRouter);

app.listen(process.env.PORT, () => console.log("Listening"));
