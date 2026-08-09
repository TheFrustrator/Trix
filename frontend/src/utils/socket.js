import { io } from "socket.io-client";

const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

const SOCKET_URL = BACKEND_URL.endsWith("/")
  ? BACKEND_URL.slice(0, -1)
  : BACKEND_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"],
});