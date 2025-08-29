// src/BLL/socketEvents.ts
import {socket} from "./connect";

let listenersBound = false;

export const setupSocketListeners = (onNewMessage: (msg: any) => void) => {
    if (listenersBound) {
        return () => {};
    }
    listenersBound = true;

    const handleConnect = () => {
        console.log("✅ Connected to socket:", socket.id);
    };

    const handleDisconnect = () => {
        console.log("❌ Disconnected");
    };

    const handleNewMessage = (msg: any) => {
        console.log("📩 Новое сообщение:", msg);
        onNewMessage(msg);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("new_message", handleNewMessage);

    // вернём функцию очистки (например, вызвать при logout)
    return () => {
        socket.off("connect", handleConnect);
        socket.off("disconnect", handleDisconnect);
        socket.off("new_message", handleNewMessage);
        listenersBound = false;
    };
};

export const joinChat = (chatId: number) => {
    socket.emit("join", {chat_id: chatId});
};

export const sendMessage = (chatId: number, userId: number, text: string, nick: string) => {
  console.log("chatId: ",chatId, "userId: ",userId, "nick: ",nick);
  socket.emit("send_message", {
        chat_id: chatId, user_id: userId, text, nick,
    });
};