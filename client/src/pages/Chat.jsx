import React, { useEffect, useState } from "react";
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

  return (
    <div className="chat-container">
      <h2>Forum</h2>

      {auth.currentUser ? (
        <>
          {/* <button onClick={logout}>Logout</button> */}
          <div className="messages h-60 overflow-y-auto">
            {messages.map((msg) => (
              <p key={msg.id}>
                <div className="chat chat-start">
                  <div className="chat-header">
                    {msg.user}
                    <time className="text-xs opacity-50">2 hours ago</time>
                  </div>
                  <div className="chat-bubble chat-bubble-secondary">{msg.text}</div>
                  <div className="chat-footer opacity-50">Seen</div>
                </div>
              </p>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="input mb-4"
          />
          <button onClick={sendMessage}>Send</button>
        </>
      ) : (
        <button onClick={signIn}>Sign in with Google</button>
      )}
    </div>
  );
}
