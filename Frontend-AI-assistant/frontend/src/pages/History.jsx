import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { pageTransition } from "../animations";
import { useAuth } from "../context/AuthContext";

function formatTimestamp(timestamp) {
  const date = timestamp ? new Date(timestamp) : null;
  return date && !Number.isNaN(date.getTime())
    ? date.toLocaleString()
    : "Unknown time";
}

export default function History() {
  const { isGuestMode } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isGuestMode) {
      setHistory([]);
      setError("History is saved only after signing in with an account.");
      setLoading(false);
      return;
    }

    api
      .get("/history")
      .then((res) => setHistory(Array.isArray(res.data) ? res.data : []))
      .catch((err) => {
        const status = err.response?.status;
        setError(
          status === 401 || status === 403
            ? "Please sign in again to view saved history."
            : "Could not load chat history.",
        );
      })
      .finally(() => setLoading(false));
  }, [isGuestMode]);

  return (
    <motion.div {...pageTransition} className="flex-1 p-6 space-y-6">
      <h2 className="text-3xl font-bold gradient-text">Chat History</h2>
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass-card p-5 animate-pulse">
              <div className="h-4 bg-gray-700 rounded w-1/3 mb-3"></div>
              <div className="h-3 bg-gray-700 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="glass-card p-5 text-red-300">{error}</p>
      ) : history.length === 0 ? (
        <p className="text-gray-400 text-lg">
          No conversations yet. Start chatting!
        </p>
      ) : (
        history.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-sm text-gray-400">
                {formatTimestamp(item.timestamp)}
              </span>
              <span className="px-2 py-1 text-xs rounded-full bg-neon-blue/20 text-neon-blue">
                {item.model || "ollama"}
              </span>
            </div>
            <p className="text-white/80 mb-2">
              <strong className="text-neon-purple">You:</strong>{" "}
              {item.message || ""}
            </p>
            <p className="text-white/70">
              <strong className="text-neon-blue">AI:</strong>{" "}
              {item.response || ""}
            </p>
          </motion.div>
        ))
      )}
    </motion.div>
  );
}
