import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  userId: String,
  messages: [{ role: String, content: String }],
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema)