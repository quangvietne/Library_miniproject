const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, ActivityLog } = require("../models");

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      role: "user",
    });
    res.status(201).json({ message: "User registered", userId: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    try {
      await ActivityLog.create({
        user_id: user.id,
        action: "login",
        details: "",
      });
    } catch (e) {}
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.registerAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      role: "admin",
    });
    res.status(201).json({ message: "Admin registered", userId: user.id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
