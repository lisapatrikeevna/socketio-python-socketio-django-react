// [changed] ChatPage adapted for role-based chats + chats service polling
import {useEffect, useMemo, useState} from "react";
import {TextField, Button, Typography, Paper, List, ListItemButton, ListItemText, Stack, Alert} from "@mui/material";
import {socket} from "../bll/socketio/connect";
import {setupSocketListeners} from "../bll/socketio/socketEvents"; // оставляем только листенеры
import {useSelector} from "react-redux";
import type {RootStateType} from "../bll/store.ts";
import type {UserType} from "../bll/auth/auth.type.ts";
import {useGetChatsQuery} from "../bll/chat.service";

export const ChatPage = () => {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const user = useSelector<RootStateType, UserType | null>(state => state.app.user);

  const isAdmin = !!user?.is_admin; // предполагаем, что в user есть is_admin
  const [selectedTargetUserId, setSelectedTargetUserId] = useState<number | null>(null);

  // [added] Получаем список чатов: админ — все, не-админ — только свой
  const {
    data: chats = [],
    isLoading: chatsLoading,
    isError: chatsError,
  } = useGetChatsQuery(undefined, {
    pollingInterval: 10000, // пуллим раз в 10 секунд
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  // [added] Вычислим «мой» чат для не-админа
  const myChat = useMemo(() => {
    if (isAdmin) return null;
    // не-админ получает ровно один чат — свой
    return Array.isArray(chats) && chats.length ? chats[0] : null;
  }, [isAdmin, chats]);

  useEffect(() => {
    socket.connect();

    // [changed] Не-админу join не нужен — сервер уже помещает его в комнату на connect
    // Для админа — будем делать join при выборе чата ниже

    setupSocketListeners((msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
/*
  // [added] Когда админ выбирает чат — отправляем join(target_user_id)
  useEffect(() => {
    if (!isAdmin) return;
    if (!selectedTargetUserId) return;

    // серверный обработчик ожидает { target_user_id }
    socket.emit("join", { target_user_id: selectedTargetUserId });
  }, [isAdmin, selectedTargetUserId]);
*/
  // [added] Унифицированная отправка сообщений
  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    if (isAdmin) {
      if (!selectedTargetUserId) return; // можно показать тост/алерт
      socket.emit("send_message", { text: trimmed, target_user_id: selectedTargetUserId });
    } else {
      // не-админ всегда шлёт в свой чат — сервер возьмёт user_id из сессии
      socket.emit("send_message", { text: trimmed });
    }
    setText("");
  };

  return (
    <div>
      <h2>Чат</h2>

      {/* [added] Панель выбора чата для админа */}
      {isAdmin && (
        <Paper sx={{p:2, mb:2}}>
          <Typography variant="h6" gutterBottom>Вы: {user.username}. Выбор чата (не-админ)</Typography>
          {chatsError && <Alert severity="error">Не удалось загрузить чаты</Alert>}
          {chatsLoading ? (
            <Typography>Загрузка чатов…</Typography>
          ) : (
            <Stack direction={{xs:'column', md:'row'}} spacing={2}>
              <Paper variant="outlined" sx={{flex:1, maxHeight:300, overflow:'auto'}}>
                <List dense>
                  {chats.map((c:any) => (
                    <ListItemButton
                      key={c.id}
                      selected={selectedTargetUserId === c.owner_id}
                      onClick={() => setSelectedTargetUserId(c.owner_id)}
                    >
                      <ListItemText
                        primary={c.owner_username || c.owner_email || `user#${c.owner_id}`}
                        secondary={c.room_name}
                      />
                    </ListItemButton>
                  ))}
                </List>
              </Paper>
              <Paper variant="outlined" sx={{flex:1, p:1}}>
                <Typography variant="body2" gutterBottom>
                  Выбран: {selectedTargetUserId ? `user#${selectedTargetUserId}` : "—"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Сообщения будут уходить в комнату выбранного пользователя и видетьcя всеми админами, подключёнными к этой комнате.
                </Typography>
              </Paper>
            </Stack>
          )}
        </Paper>
      )}

      {/* [added] для не-админа — короткий инфо-блок о его комнате */}
      {!isAdmin && myChat && (
        <Paper sx={{p:2, mb:2}}>
          <Typography variant="body2">
            Ваш чат: <b>{myChat.room_name}</b><br/>
            Вы: <b>{user.username}</b>
          </Typography>
        </Paper>
      )}

      <div style={{border: "1px solid gray", padding: "10px", marginBottom: "10px"}}>
        {messages.map((m, i) => (
          <div key={i}>
            {/* [changed] поддерживаем новый payload: chat (room_name), chat_id, user_id */}
            <strong>User {m.nick ?? m.user_id ?? "?"}:</strong>{" "}
            <b>Chat {m.chat ?? m.chat_id ?? "?"}</b>{" "}
            {m.text}
          </div>
        ))}
      </div>

      <Paper sx={{p:2, mb:1}}>
        <Typography>Написать сообщение</Typography>
        {/* [changed] убрали select chatId вручную — админ выбирает из списка, не-админу это не нужно */}
      </Paper>

      <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
        <TextField
          fullWidth
          label="Сообщение"
          variant="outlined"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && text.trim()) {
              handleSend();
            }
          }}
        />
        <Button
          variant="contained"
          onClick={handleSend}
          disabled={isAdmin && !selectedTargetUserId}
        >
          Отправить
        </Button>
      </div>
    </div>
  );
};