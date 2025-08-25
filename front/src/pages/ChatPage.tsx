import {useEffect, useState} from "react";
import {TextField, Button} from "@mui/material";
import {socket} from "../bll/socketio/connect";
import {joinChat, sendMessage, setupSocketListeners} from "../bll/socketio/socketEvents";
import {useSelector} from "react-redux";
import type {RootStateType} from "../bll/store.ts";
import type {UserType} from "../bll/auth/auth.type.ts";

export const ChatPage = () => {
    const [text, setText] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const user = useSelector<RootStateType, UserType | null>(state => state.app.user);


    useEffect(() => {
        socket.connect();
        joinChat(1);
        setupSocketListeners((msg) => {
            setMessages((prev) => [...prev, msg]);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (<div>
        <h2>Чат</h2>
        <div style={{border: "1px solid gray", padding: "10px", marginBottom: "10px"}}>
            {messages.map((m, i) => (<div key={i}>
                <strong>User {m.user_id}:</strong> {m.text}
            </div>))}
        </div>

        <div style={{display: "flex", gap: "10px", marginTop: "10px"}}>
            <TextField fullWidth label="Сообщение" variant="outlined" value={text}
                       onChange={(e) => setText(e.target.value)}
                       onKeyDown={(e) => {
                           if (e.key === "Enter" && text.trim()) {
                               sendMessage(1, 3, text.trim());
                               setText("");
                           }
                       }}
            />
            <Button variant="contained" onClick={() => {
                    if (text.trim()) {
                        sendMessage(1, 1, text.trim(),user?.username||'Vasya');
                        setText("");
                    } }} >
                Отправить
            </Button>
        </div>
    </div>);
};