import { io } from "socket.io-client";

export const socket = io("http://localhost:8002", {
  transports: ["websocket"],
  autoConnect: true,
});