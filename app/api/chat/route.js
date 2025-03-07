import OpenAI from "openai";
import { connectDB } from "@/lib/mongodb";
import Chat from "@/models/Chat";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req) {
  try {
    await connectDB();
    const { userId, userMessage } = await req.json();

    const chatHistory = await Chat.findOne({ userId }) || new Chat({ userId, messages: [] });

    chatHistory.messages.push({ role: "user", content: userMessage });

    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: chatHistory.messages,
    });

    const botMessage = aiResponse.choices[0].message.content;

    chatHistory.messages.push({ role: "assistant", content: botMessage });
    await chatHistory.save();

    return new Response(JSON.stringify({ botMessage }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "API Error!" }), { status: 500 });
  }
}
