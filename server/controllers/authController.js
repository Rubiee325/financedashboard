const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/* SIGNUP */
exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // ✅ ADD ROLE LOGIC HERE
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: email === "admin@gmail.com" ? "admin" : "viewer"
    });

    res.status(201).json({
      success: true,
      message: "Signup successful",
      user: {
        name: user.name,
        role: user.role
      }
    });

  } catch (err) {
    console.error("Signup Error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* LOGIN */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ CHECK PASSWORD (IMPORTANT FIX)
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role   // ✅ ROLE SENT TO FRONTEND
      }
    });

  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ message: err.message });
  }
};