// src/BLL/socketEvents.ts

import {socket} from "./connect.ts";

// socketEvents.ts
export const setupSocketListeners = (onNewMessage: (msg: any[]) => void) => {
  socket.on("connect", () => {
    console.log("✅ Connected to socket:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("❌ Disconnected");
  });

  socket.on("new_message", (msg) => {
    console.log("📩 Новое сообщение:", msg);
    onNewMessage(msg);
  });
};

export const joinChat = (chatId: number) => {
  socket.emit("join", { chat_id: chatId });
};

export const sendMessage = (chatId: number, userId: number, text: string,nick:string) => {
  socket.emit("send_message", {
    chat_id: chatId,
    user_id: userId,
    text, nick,
  });
};