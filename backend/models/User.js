import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, default: "User" },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "manager", "expert", "user"], default: "user" },
  otpHash: { type: String, default: null },
  otpExpires: { type: Date, default: null }
}, { timestamps: true });

export default mongoose.model("User", userSchema);
