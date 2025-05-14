import React, { useState } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;

export default function Chat() {
  const [inputValue, setInputValue] = useState("");
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendPrompt = async (prompt) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/gemini/generate`,
        { prompt },
        { withCredentials: true }
      );
      return response.data.response; // response.text() is already parsed by backend
    } catch (error) {
      console.error("Error generating Gemini content:", error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    setLoading(true);
    try {
      const geminiResponse = await sendPrompt(inputValue);
      setResponses([...responses, geminiResponse]);
      setInputValue("");
    } catch (err) {
      // handle UI error here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container">
      <div className="bg-primary h-10 flex items-center rounded-t-lg p-4 text-white">
        <h2 className="mb-4">Gemini Chat</h2>
      </div>

      <input
        type="text"
        className="form-control mb-2"
        placeholder="Enter prompt..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={loading}
      />
      <button
        onClick={handleSend}
        className="btn btn-primary mb-3"
        disabled={loading}
      >
        {loading ? "Thinking..." : "Send"}
      </button>
      <div>
        {responses.map((res, idx) => (
          <p
            key={idx}
            className={idx === responses.length - 1 ? "fw-bold" : ""}
          >
            {res}
          </p>
        ))}
      </div>
    </div>
  );
}
