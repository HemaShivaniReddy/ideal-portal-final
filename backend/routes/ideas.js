import express from "express";
import Idea from "../models/Idea.js";
import { auth, requireManager } from "../middleware/auth.js";

const router = express.Router();

router.post("/", auth, async (req, res) => {
  try {
    const { title, problemStatement, expectedImpact } = req.body;
    const idea = new Idea({
      title,
      problemStatement,
      expectedImpact,
      createdBy: req.user._id
    });
    await idea.save();
    res.status(201).json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.get("/", auth, async (req, res) => {
  const ideas = await Idea.find().populate("createdBy", "name email role").sort({ createdAt: -1 });
  res.json(ideas);
});

router.put("/:id/status", auth, requireManager, async (req, res) => {
  try {
    const { status } = req.body;
    if (!["pending", "approved", "rejected", "on-hold"].includes(status)) return res.status(400).json({ message: "Invalid status" });
    const idea = await Idea.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

router.post("/:id/comments", auth, async (req, res) => {
  try {
    const { text } = req.body;
    const idea = await Idea.findById(req.params.id);
    if (!idea) return res.status(404).json({ message: "Idea not found" });
    idea.comments.push({ text, user: req.user._id });
    await idea.save();
    res.json(idea);
  } catch (err) {
    res.status(500).json({ message: err.message || "Server error" });
  }
});

export default router;
