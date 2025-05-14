import React, { useEffect, useState, useRef, useContext } from "react";
import {
  db,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "../firebase";
import { AuthContext } from "../helpers/AuthContext";
export default function Chat() {
  const { authState } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const bottomRef = useRef(null);

  // Send Message
  const sendMessage = async () => {
    if (message.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: message,
      createdAt: new Date(),
      user: authState.username,
      uid: authState.email,
    });

    setMessage("");
  };

  // Fetch Messages in Real-Time
  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const formatDate = (timestamp) => {
    const messageDate = new Date(timestamp * 1000); // Convert Firestore timestamp to JavaScript Date object
    const today = new Date();

    // Check if the message was sent today
    const isToday = messageDate.toDateString() === today.toDateString();

    // Format based on whether it's today or not
    if (isToday) {
      // Display only the time if today
      return messageDate.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      // Display full date and time for other days
      return messageDate.toLocaleString([], {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  return (
    <div className="chat-container">
      <div className="bg-primary h-10 flex items-center rounded-t-lg p-4 text-white">
        <h2>Forum</h2>
      </div>

      {authState.status ? (
        <>
          <div className="messages h-75 overflow-y-auto p-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat ${
                  msg.user === authState.username ? "chat-end" : "chat-start"
                }`}
              >
                <div className="chat-header">
                  {msg.user}
                  <time className="text-xs opacity-50">
                    {formatDate(msg.createdAt.seconds)}{" "}
                    {/* assuming createdAt is a Firestore timestamp */}
                  </time>
                </div>
                <div
                  className={`chat-bubble ${
                    msg.user === authState.username
                      ? "chat-bubble-secondary"
                      : ""
                  }`}
                >
                  {msg.text}
                </div>
                <div className="chat-footer opacity-50">Seen</div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div className="flex justify-center items-center gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="input border"
            />
            <button onClick={sendMessage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-8 text-primary"
              >
                <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
              </svg>
            </button>
          </div>
        </>
      ) : (
        <p className="text-center p-4">Please sign in to use the forum.</p>
      )}
    </div>
  );
}
