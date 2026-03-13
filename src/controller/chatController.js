import OpenAI from "openai";
import dotenv from "dotenv";
import { Chat } from "../models/chat.models.js";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",  // ← This makes it use Groq instead of OpenAI
});

export const sendMessage = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== "string" || message.trim() === "") {
    return res.status(400).json({ error: "Valid message is required" });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "llama-3.3-70b-versatile",   // Strong free Groq model – change if needed
      // Alternatives (also free): 
      // "llama-3.1-8b-instant"     → faster, smaller, higher limits
      // "mixtral-8x7b-32768"       → good balance
      // "gemma2-9b-it"             → smaller & quick
      messages: [
        { role: "system", content: "You are a helpful, friendly AI assistant." },  // Optional: improves responses
        { role: "user", content: message }
      ],
      temperature: 0.7,          // 0.0 = deterministic, 1.0+ = creative
      max_tokens: 1024,          // Limit response length to avoid token overuse
      top_p: 0.9,
    });

    const aiReply = completion.choices[0]?.message?.content?.trim() 
      || "Sorry, I couldn't generate a response right now.";

    // Save chat to MongoDB
    await Chat.create({
      userMessage: message,
      aiReply,
      createdAt: new Date(),
    });

    return res.status(200).json({ reply: aiReply });
  } catch (error) {
    console.error("Groq API Error:", error?.response?.data || error.message || error);

    let errorMessage = "Something went wrong with the AI service.";
    const status = error?.response?.status;

    if (status === 429) {
      errorMessage = "Rate limit reached – please try again in a minute or two. Groq free tier has limits like ~30 requests/min.";
    } else if (status === 401 || status === 403) {
      errorMessage = "Invalid or unauthorized API key – double-check your .env file.";
    } else if (status === 400) {
      errorMessage = "Bad request – check the message format.";
    }

    return res.status(500).json({ 
      error: errorMessage,
      details: error.message || "No additional details"
    });
  }
};