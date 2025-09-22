import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import User from "../models/User.js";
import { auth, requireAdmin } from "../middleware/auth.js";
import { sendEmail } from "../utils/mailer.js";

const router = express.Router();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
function hashOTP(otp) {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ message: "Missing fields" });

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already registered" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed, role: "user" });
    await user.save();

    res.json({ message: "Registered. Please login to receive OTP." });
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const ttl = parseInt(process.env.OTP_TTL_MINUTES || "10", 10);
    user.otpHash = otpHash;
    user.otpExpires = new Date(Date.now() + ttl * 60 * 1000);
    await user.save();

    const subject = "Your Ideal Portal OTP";
    const text = `Your one-time verification code is: ${otp}\nThis code expires in ${ttl} minutes.`;
    const html = `<p>Your one-time verification code is: <strong>${otp}</strong></p><p>Expires in ${ttl} minutes.</p>`;

    await sendEmail({ to: user.email, subject, text, html });

    res.json({ message: "OTP sent to your email. Verify to complete login." });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.post("/verify-otp", async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user || !user.otpHash || !user.otpExpires) return res.status(400).json({ message: "No pending OTP" });

    if (user.otpExpires < new Date()) {
      user.otpHash = null;
      user.otpExpires = null;
      await user.save();
      return res.status(400).json({ message: "OTP expired. Please login again." });
    }

    const providedHash = crypto.createHash("sha256").update(otp).digest("hex");
    if (providedHash !== user.otpHash) return res.status(400).json({ message: "Invalid OTP" });

    user.otpHash = null;
    user.otpExpires = null;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error("Verify OTP error:", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.get("/users", auth, requireAdmin, async (req, res) => {
  const users = await User.find().select("-password -otpHash -otpExpires");
  res.json(users);
});

router.post("/assign-role", auth, requireAdmin, async (req, res) => {
  try {
    const { userId, role } = req.body;
    if (!userId || !role) return res.status(400).json({ message: "Missing fields" });
    if (!["user", "manager", "expert", "admin"].includes(role)) return res.status(400).json({ message: "Invalid role" });

    const u = await User.findById(userId);
    if (!u) return res.status(404).json({ message: "User not found" });
    u.role = role;
    await u.save();
    res.json({ message: "Role updated", user: { id: u._id, role: u.role } });
  } catch (err) {
    console.error("Assign role error", err);
    res.status(500).json({ message: err.message || "Server error" });
  }
});

export default router;
