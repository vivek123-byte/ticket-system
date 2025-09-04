import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authenticate = async (req, res, next) => {
  console.log("JWT_SECRET in auth middleware:", process.env.JWT_SECRET);

  try {
    const authHeader = req.headers.authorization;
    console.log("Auth header received:", authHeader);

    if (!authHeader)
      return res.status(401).json({ error: "No Authorization header" });

    const token = authHeader.split(" ")[1];
    console.log("Extracted token:", token);

    if (!token) return res.status(401).json({ error: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);

    const user = await User.findById(decoded._id).select("-password");
    if (!user) return res.status(401).json({ error: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    res.status(401).json({ error: "Invalid token" });
  }
};
