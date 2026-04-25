import { useState, useEffect, useCallback, useRef } from "react";
import { connect, disconnect, subscribe, send } from "../services/socket";
import { useAuth } from "../context/AuthContext";

export default function useChat() {
  const { token, isGuestMode } = useAuth();
  const demoTimerRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [streamingText, setStreamingText] = useState("");
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [model, setModel] = useState("ollama");

  useEffect(() => {
    if (!token || isGuestMode) return;
    setError("");
    connect(token, {
      onConnected: () => setConnected(true),
      onDisconnected: () => setConnected(false),
      onError: setError,
    });
    return () => {
      setConnected(false);
      disconnect();
    };
  }, [token, isGuestMode]);

  useEffect(() => {
    if (!connected || isGuestMode) return;
    const userSub = subscribe("/user/queue/messages", (msg) => {
      setMessages((prev) => [...prev, { ...msg, timestamp: new Date() }]);
    });
    const streamSub = subscribe("/user/queue/stream", (chunk) => {
      if (chunk.done) {
        setStreamingText("");
      } else {
        setStreamingText((prev) => prev + chunk.chunk);
      }
    });
    const errorSub = subscribe("/user/queue/errors", (message) => {
      setStreamingText("");
      setError(typeof message === "string" ? message : "AI response failed.");
    });
    return () => {
      userSub?.unsubscribe();
      streamSub?.unsubscribe();
      errorSub?.unsubscribe();
    };
  }, [connected, isGuestMode]);

  useEffect(
    () => () => {
      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
    },
    [],
  );

  const sendMessage = useCallback(
    (text) => {
      const message = text.trim();
      if (!message) return false;

      if (connected) {
        setError("");
        send("/app/sendMessage", { message, model });
        return true;
      }

      if (!isGuestMode) {
        setError("Chat is not connected yet. Make sure the backend is running.");
        return false;
      }

      setMessages((prev) => [
        ...prev,
        { sender: "user", content: message, timestamp: new Date() },
      ]);
      setStreamingText("Thinking in demo mode...");

      if (demoTimerRef.current) clearTimeout(demoTimerRef.current);
      demoTimerRef.current = setTimeout(() => {
        setStreamingText("");
        setMessages((prev) => [
          ...prev,
          {
            sender: "assistant",
            content:
              "Demo mode reply: UI is running without backend. Start the backend later for real AI responses.",
            timestamp: new Date(),
          },
        ]);
      }, 600);

      return true;
    },
    [connected, model, isGuestMode],
  );

  return {
    messages,
    streamingText,
    sendMessage,
    connected: connected || isGuestMode,
    error,
    model,
    setModel,
  };
}
