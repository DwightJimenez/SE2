import React, { useEffect, useState, useRef } from "react";
import {
  db,
  auth,
  provider,
  signInWithPopup,
  signOut,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "../firebase";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const bottomRef = useRef(null);

  // Sign In with Google
  const signIn = async () => {
    provider.setCustomParameters({ prompt: "select_account" });
    await signInWithPopup(auth, provider);
  };

  // Sign Out
  const logout = () => {
    signOut(auth);
  };

  // Send Message
  const sendMessage = async () => {
    if (message.trim() === "") return;

    await addDoc(collection(db, "messages"), {
      text: message,
      createdAt: new Date(),
      user: auth.currentUser.displayName,
      uid: auth.currentUser.uid,
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

  return (
    <div className="chat-container">
      <div className="bg-primary h-10 flex items-center rounded-t-lg p-4 text-white">
        <h2>Forum</h2>
      </div>

      {auth.currentUser ? (
        <>
          {/* <button onClick={logout}>Logout</button> */}
          <div className="messages h-75 overflow-y-auto p-4">
            {messages.map((msg) => (
              <p key={msg.id}>
                <div className="chat chat-end">
                  <div className="chat-header">
                    {msg.user}
                    <time className="text-xs opacity-50">2 hours ago</time>
                  </div>
                  <div className="chat-bubble chat-bubble-secondary">
                    {msg.text}
                  </div>
                  <div className="chat-footer opacity-50">Seen</div>
                </div>
              </p>
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
        <button onClick={signIn}>Sign in with Google</button>
      )}
    </div>
  );
}
