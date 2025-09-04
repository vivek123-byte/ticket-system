import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { inngest } from "../inngest/client.js";

export const signup = async (req, res) => {
  const { email, password, skills = [] } = req.body;
  console.log("Signup route hit", req.body);

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed, skills });

    await inngest.send({ name: "user/signup", data: { email } });

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ user, token });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Signup failed", details: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("JWT_SECRET in login:", process.env.JWT_SECRET);

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    console.log("Generated Token:", token);
    res.json({ user, token });
  } catch (error) {
    console.error("Login failed:", error.message);
    res.status(500).json({ error: "Login failed", details: error.message });
  }
};

export const logout = async (req, res) => {
  res.json({ message: "Logout successfully (client should delete token)" });
};

export const updateUser = async (req, res) => {
  const { skills = [], role, email } = req.body;
  if (req.user?.role !== "admin") return res.status(403).json({ error: "Forbidden" });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    await User.updateOne({ email }, { skills: skills.length ? skills : user.skills, role });
    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Update failed", details: err.message });
  }
};

export const getUsers = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Forbidden" });

  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Fetch failed", details: err.message });
  }
};
