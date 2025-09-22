import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ideal_portal";

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for seeding");

    const email = process.env.SEED_ADMIN_EMAIL || "admin@gmail.com";
    const password = process.env.SEED_ADMIN_PASSWORD || "Admin@123";
    const name = process.env.SEED_ADMIN_NAME || "Admin";

    const existing = await User.findOne({ email });
    if (existing) {
      console.log("Admin already exists:", email);
    } else {
      const hashed = await bcrypt.hash(password, 10);
      const admin = new User({ name, email, password: hashed, role: "admin" });
      await admin.save();
      console.log(`Seeded admin -> ${email} / ${password}`);
    }

    await mongoose.disconnect();
    console.log("Seeding complete");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
