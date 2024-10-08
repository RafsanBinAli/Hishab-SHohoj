var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var mongoose = require("mongoose"); 
var cors = require("cors");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var transactionRouter = require("./routes/transaction")
var debtRouter =require("./routes/debt")
var bankRouter =require("./routes/bank")
const dotenv = require('dotenv').config()
require('./config/cronJob'); 
const connectDB = require("./config/Database")
var app = express();

const MONGODB_URI = process.env.MONGODB_URI;

connectDB();


// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/transaction",transactionRouter)
app.use("/debt",debtRouter)
app.use("/bank",bankRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
