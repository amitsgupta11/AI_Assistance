
import { useEffect, useRef, useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm Nova, your personal AI assistant. How can I help?",
    },
  ]);
  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
      window.speechSynthesis?.cancel();
    };
  }, []);

  function speak(textToSpeak) {
    if (!voiceEnabled || !("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = "en-IN";
    utterance.rate = 1;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition isn't supported here. Please type.");
      return;
    }

    window.speechSynthesis?.cancel();
    setError("");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
    };

    recognition.onerror = () => {
      setError("Couldn't recognize your voice. Please try again.");
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }

  async function sendMessage(event) {
    event?.preventDefault();

    const content = text.trim();
    if (!content || loading) return;

    const updatedMessages = [
      ...messages,
      { role: "user", content },
    ];

    setMessages(updatedMessages);
    setText("");
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages
            .filter((m) => ["user", "assistant"].includes(m.role))
            .slice(-10),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      const reply = data.reply || "I couldn't generate a response.";

      setMessages((current) => [
        ...current,
        { role: "assistant", content: reply },
      ]);

      speak(reply);
    } catch (err) {
      setError(err.message || "Unable to contact Nova AI.");
    } finally {
      setLoading(false);
    }
  }

  function stopVoice() {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    setListening(false);
    setSpeaking(false);
  }

  function clearChat() {
    stopVoice();
    setMessages([
      {
        role: "assistant",
        content: "Chat cleared! What would you like to talk about?",
      },
    ]);
    setError("");
  }

  return (
    <main className="app">
      <header className="topbar">
        <a className="brand" href="/">
          <span className="brand-icon">✦</span>
          Nova AI
        </a>
        <button className="clear-button" onClick={clearChat}>
          New chat
        </button>
      </header>

      <section className="hero">
        <div className={`orb ${listening ? "active" : ""}`}>
          <span>✦</span>
        </div>
        <p className="eyebrow">YOUR PERSONAL AI</p>
        <h1>
          {listening
            ? "I'm listening..."
            : speaking
            ? "Speaking to you..."
            : loading
            ? "Thinking..."
            : "How can I help you?"}
        </h1>
        <p className="subtitle">
          Ask a question, explore an idea, or just talk.
        </p>
      </section>

      <section className="chat" aria-live="polite">
        {messages.map((message, index) => (
          <article
            className={`message ${message.role}`}
            key={`${index}-${message.role}`}
          >
            <span className="message-label">
              {message.role === "user" ? "You" : "Nova"}
            </span>
            <p>{message.content}</p>
            {message.role === "assistant" && (
              <button
                className="replay"
                aria-label="Read response aloud"
                onClick={() => speak(message.content)}
              >
                🔊 Listen
              </button>
            )}
          </article>
        ))}
        {loading && <p className="loading">Nova is thinking...</p>}
        <div ref={bottomRef} />
      </section>

      {error && <p className="error">{error}</p>}

      <form className="composer" onSubmit={sendMessage}>
        <button
          type="button"
          className={`mic ${listening ? "listening" : ""}`}
          onClick={listening ? stopVoice : startListening}
          aria-label={listening ? "Stop listening" : "Start voice input"}
          title="Voice input"
        >
          {listening ? "■" : "🎙"}
        </button>

        <input
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Message Nova or tap the microphone..."
          aria-label="Message Nova"
          maxLength={4000}
        />

        <button className="send" type="submit" disabled={loading || !text.trim()}>
          Send ↑
        </button>
      </form>

      <footer className="footer">
        <label className="voice-toggle">
          <input
            type="checkbox"
            checked={voiceEnabled}
            onChange={(event) => {
              setVoiceEnabled(event.target.checked);
              if (!event.target.checked) stopVoice();
            }}
          />
          Speak replies
        </label>
        <button className="stop-button" onClick={stopVoice}>
          Stop audio
        </button>
        <span>AI can make mistakes. Verify important information.</span>
      </footer>
    </main>
  );
}
