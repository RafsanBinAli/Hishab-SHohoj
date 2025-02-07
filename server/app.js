const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const http = require('http');
require('dotenv').config();
require('./config/cronJob');

// Import routes
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const transactionRouter = require("./routes/transaction");
const debtRouter = require("./routes/debt");
const bankRouter = require("./routes/bank");

// Database connection
const connectDB = require("./config/Database");

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});

// Middleware setup
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Routes
app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/transaction", transactionRouter);
app.use("/debt", debtRouter);
app.use("/bank", bankRouter);

// 404 handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: req.app.get("env") === "development" ? err : {}
  });
});

// Server setup
const port = process.env.PORT || '4000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;