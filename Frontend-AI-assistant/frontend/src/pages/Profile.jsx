import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { pageTransition } from "../animations";

export default function Profile() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard")
      .then((res) => setStats(res.data))
      .catch(() => setError("Could not load dashboard stats."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <motion.div {...pageTransition} className="flex-1 p-6 space-y-8">
      <h2 className="text-3xl font-bold gradient-text">Profile</h2>

      {/* User Info Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-2xl font-bold">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-xl font-semibold">{user?.username}</h3>
            <p className="text-gray-400">{user?.email}</p>
          </div>
        </div>
      </motion.div>

      {/* Dashboard Stats */}
      <h3 className="text-2xl font-bold">Dashboard</h3>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="glass-card p-5 h-28 flex flex-col justify-center"
            >
              <div className="h-4 bg-gray-700 rounded w-1/2 mb-3"></div>
              <div className="h-8 bg-gray-700 rounded w-1/3"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <p className="glass-card p-5 text-red-300">{error}</p>
      ) : stats ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="grid grid-cols-2 md:grid-cols-3 gap-4"
        >
          {[
            { label: "Total Chats", value: stats.totalChats },
            { label: "Total Notes", value: stats.totalNotes },
            { label: "Ollama Usage", value: stats.ollamaCount || 0 },
            { label: "Chats Today", value: stats.todayChats },
            { label: "This Week", value: stats.weekChats },
          ].map((item, idx) => (
            <motion.div
              key={idx}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              className="glass-card p-5 flex flex-col justify-center hover:border-neon-blue/50 transition-all"
            >
              <span className="text-sm text-gray-400">{item.label}</span>
              <span className="text-3xl font-bold text-neon-blue mt-1">
                {item.value}
              </span>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <p className="text-gray-400">Failed to load stats.</p>
      )}
    </motion.div>
  );
}
