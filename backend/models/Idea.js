import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  text: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const IdeaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  problemStatement: { type: String },
  expectedImpact: { type: String },
  status: { type: String, enum: ["pending", "approved", "rejected", "on-hold"], default: "pending" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  comments: [CommentSchema]
}, { timestamps: true });

export default mongoose.model("Idea", IdeaSchema);
