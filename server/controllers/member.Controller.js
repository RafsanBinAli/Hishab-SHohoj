const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Member = require("../models/Member");
require("dotenv").config();

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await Member.findOne({ username: username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET_KEY,
      
    );

    res.status(200).json({ message: "Login successful", token: token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

exports.signUpUser = async (req, res) => {
  const { username, phoneNumber, password, village,fullName } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await Member.findOne({ username: username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already taken" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new Member({
      username: username,
      phoneNumber: phoneNumber,
      password: hashedPassword,
      village: village,
      fullName:fullName,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
