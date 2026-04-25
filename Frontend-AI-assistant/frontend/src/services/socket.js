import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

let stompClient = null;

const socketUrl = import.meta.env.VITE_WS_URL || "/ws-chat";

export const connect = (token, { onConnected, onDisconnected, onError } = {}) => {
  const socket = new SockJS(socketUrl);
  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: { Authorization: `Bearer ${token}` },
    onConnect: () => onConnected?.(),
    onDisconnect: () => onDisconnected?.(),
    onWebSocketClose: () => onDisconnected?.(),
    onWebSocketError: () => onError?.("Could not reach the backend chat server."),
    onStompError: (frame) => {
      console.error("WebSocket error:", frame);
      onError?.(frame.headers?.message || "Chat connection failed.");
    },
    reconnectDelay: 3000,
  });
  stompClient.activate();
  return stompClient;
};

export const disconnect = () => stompClient?.deactivate();

export const subscribe = (destination, callback) => {
  return stompClient?.subscribe(destination, (message) => {
    try {
      callback(JSON.parse(message.body));
    } catch {
      callback(message.body);
    }
  });
};

export const send = (destination, body) => {
  stompClient?.publish({ destination, body: JSON.stringify(body) });
};

export const isConnected = () => stompClient?.connected;
