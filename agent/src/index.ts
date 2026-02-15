import express from "express";
import { chat } from "./agent.js";
import { loadSession, saveSession } from "./store.js";

const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const message = req.body?.message;
  const sessionId = req.body?.sessionId;

  if (typeof message !== "string") {
    res.status(400).json({ error: "body.message (string) required" });
    return;
  }

  try {
    const history = sessionId ? loadSession(sessionId) : [];
    const { reply, newMessages } = await chat(message, history);
    if (sessionId) saveSession(sessionId, newMessages);
    res.json({ reply });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
});

const port = Number(process.env.PORT) || 3141;
app.listen(port, () => {
  console.log(`Agent listening on http://localhost:${port}`);
});
