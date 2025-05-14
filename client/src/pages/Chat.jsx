import React, { useState, useRef, useEffect } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendPrompt = async (prompt) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/gemini/generate`,
        { prompt },
        { withCredentials: true }
      );
      return response.data.response;
    } catch (error) {
      console.error("Error generating Gemini content:", error);
      throw error;
    }
  };

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const userMessage = { role: "user", text: trimmed };
      setMessages((prev) => [...prev, userMessage]);

      const botReply = await sendPrompt(trimmed);
      const botMessage = { role: "bot", text: botReply };
      setMessages((prev) => [...prev, botMessage]);

      setInputValue("");
    } catch (err) {
      // optional: handle error in UI
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container w-full max-w-xl mx-auto flex flex-col h-full">
      <div className="bg-primary h-12 flex items-center rounded-t-lg px-4 text-white font-bold">
        Gemini Chat
      </div>

      <div className="bg-white flex-1 p-4 overflow-y-auto border-x border-b rounded-b-lg space-y-3">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`${
              msg.role === "user" ? "text-blue-600" : "text-gray-800"
            }`}
          >
            <span className="font-semibold">
              {msg.role === "user" ? "You" : "Gemini"}:
            </span>{" "}
            {msg.text}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="mt-2 flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Enter prompt..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          className="bg-primary text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Thinking..." : "Send"}
        </button>
      </div>
    </div>
  );
}
