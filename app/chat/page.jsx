
"use client";

import { useSession, signIn } from "next-auth/react";
import { useState } from "react";

export default function ChatPage() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ userId: session?.user?.email, userMessage: input }),
    });

    const data = await res.json();
    setMessages([...messages, userMessage, { role: "assistant", content: data.botMessage }]);
  };

  if (!session) return <button onClick={() => signIn("google")}>Sign in with Google</button>;

  return (
    <div className="p-5">
      <h1>Chat with AI</h1>
      <div className="h-80 overflow-auto border p-3">
        {messages.map((msg, i) => (
          <p key={i} className={msg.role === "user" ? "text-blue-600" : "text-green-600"}>
            {msg.content}
          </p>
        ))}
      </div>
      <input value={input} onChange={(e) => setInput(e.target.value)} className="border p-2 w-full" />
      <button onClick={sendMessage} className="bg-blue-500 text-white p-2 mt-2">Send</button>
    </div>
  );
}
