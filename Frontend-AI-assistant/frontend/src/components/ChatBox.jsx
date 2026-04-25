import { useState } from "react";
import { motion } from "framer-motion";
import useChat from "../hooks/useChat";
import Message from "./Message";
import LoadingSkeleton from "./LoadingSkeleton";

export default function ChatBox() {
  const { messages, streamingText, sendMessage, connected, error } = useChat();
  const [input, setInput] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    const sent = sendMessage(input);
    if (sent) setInput("");
  };

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] p-4">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((msg, idx) => (
          <Message key={idx} message={msg} />
        ))}
        {streamingText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 rounded-xl self-start max-w-[80%]"
          >
            <p>
              {streamingText}
              <span className="animate-pulse">|</span>
            </p>
          </motion.div>
        )}
        {!connected && messages.length === 0 && (
          <div className="glass-card p-4 text-sm text-gray-300">
            Connecting to chat...
            <div className="mt-4">
              <LoadingSkeleton />
            </div>
          </div>
        )}
        {error && <div className="glass-card p-4 text-sm text-red-300">{error}</div>}
      </div>
      <form onSubmit={handleSend} className="glass-card p-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={connected ? "Ask anything..." : "Waiting for connection..."}
          className="flex-1 bg-transparent border-none outline-none px-4 py-2 text-white placeholder-gray-400"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={!connected || !input.trim()}
          className="px-6 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-full font-semibold disabled:cursor-not-allowed disabled:opacity-50"
          type="submit"
        >
          Send
        </motion.button>
      </form>
    </div>
  );
}
