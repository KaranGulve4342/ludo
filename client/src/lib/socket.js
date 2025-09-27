import { io } from "socket.io-client"
import { logger } from "./logger.js"

let socket

export function getSocket() {
  if (!socket) {
    const url = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000"
    socket = io(url, {
      transports: ["websocket"],
      autoConnect: true,
      withCredentials: true,
    })
    socket.on("connect", () => logger.info("Socket connected", socket.id))
    socket.on("disconnect", (r) => logger.warn("Socket disconnected", r))
    socket.on("connect_error", (e) => logger.error("Socket error", e?.message))
  }
  return socket
}
