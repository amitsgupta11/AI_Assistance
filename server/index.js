
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

if (!process.env.GROQ_API_KEY) {
  throw new Error("Missing GROQ_API_KEY in server/.env");
}


const ai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});


app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
}));
app.use(express.json({ limit: "20kb" }));

app.use("/api/chat", rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", name: "Nova AI API" });
});


app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({
        error: "Please provide at least one message.",
      });
    }

    const history = messages.slice(-10);

    const invalid = history.some(
      (m) =>
        !m ||
        !["user", "assistant"].includes(m.role) ||
        typeof m.content !== "string" ||
        !m.content.trim() ||
        m.content.length > 4000
    );

    if (invalid) {
      return res.status(400).json({
        error: "Invalid message history.",
      });
    }

    const completion = await ai.chat.completions.create({
      model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            "You are Nova, a helpful personal AI voice assistant. " +
            "Answer naturally, clearly, and concisely. " +
            "The answer may be read aloud, so avoid unnecessary formatting.",
        },
        ...history,
      ],
      max_completion_tokens: 700,
    });

    const reply =
      completion.choices[0]?.message?.content;

    res.json({
      reply: reply || "I couldn't generate a response.",
    });
  } catch (error) {
    console.error(
      "Groq API error:",
      error.status || "",
      error.message
    );

    res.status(500).json({
      error:
        "Nova couldn't respond. Check your API key, model access, and usage limits.",
    });
  }
});


app.listen(port, "0.0.0.0", () => {
  console.log(`Nova AI API running on port ${port}`);
});
