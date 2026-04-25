import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { pageTransition } from "../animations";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, register, enterGuestMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        await login(username, password);
      } else {
        await register(username, password);
      }
      navigate("/chat");
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    }
  };

  return (
    <motion.div
      {...pageTransition}
      className="min-h-screen flex items-center justify-center bg-dark-bg"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="glass-card p-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold gradient-text text-center mb-8">
          {isLogin ? "Welcome Back" : "Create Account"}
        </h2>
        {error && <p className="text-red-400 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-neon-blue transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl focus:outline-none focus:border-neon-blue transition-colors"
              required
            />
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-neon-blue to-neon-purple rounded-xl font-bold text-lg neon-glow"
          >
            {isLogin ? "Sign In" : "Sign Up"}
          </motion.button>
        </form>
        <p className="mt-6 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-neon-blue hover:underline"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
        <button
          type="button"
          onClick={() => {
            enterGuestMode();
            navigate("/chat");
          }}
          className="mt-4 w-full rounded-xl border border-white/20 bg-white/10 py-3 text-sm font-semibold text-white/90 transition-colors hover:bg-white/20"
        >
          Continue as Guest
        </button>
      </motion.div>
    </motion.div>
  );
}
