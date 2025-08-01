import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import ChatBox from "../components/ChatBox";
import EmojiInput from "../components/EmojiInput";

const API = import.meta.env.VITE_API_BASE_URL;
const socket = io(API, { autoConnect: false });

export default function ChatPage({ user }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [target, setTarget] = useState("");
  const [text, setText] = useState("");
  const [typingUser, setTypingUser] = useState("");
  const [dark, setDark] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    if (!user?.username) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (!user?.username) return;

    socket.connect();

    socket.on("receive_message", (msg) => {
      if (
        (msg.recipient === user.username && msg.sender === target) ||
        (msg.sender === user.username && msg.recipient === target)
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("display_typing", ({ sender }) => {
      if (sender !== user.username) {
        setTypingUser(sender);
        setTimeout(() => setTypingUser(""), 2000);
      }
    });

    return () => {
      socket.off("receive_message");
      socket.off("display_typing");
      socket.disconnect();
    };
  }, [user, target]);

  useEffect(() => {
    if (!target) return;
    axios
      .get(`${API}/api/chat/messages?user=${user.username}&target=${target}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Message fetch error", err));
  }, [target]);

  const send = () => {
    if (!text) return;
    socket.emit("send_message", {
      sender: user.username,
      recipient: target || null,
      content: text,
      avatar: user.avatar,
    });
    setText("");
  };

  const handleTyping = () => {
    socket.emit("typing", { sender: user.username });
  };

  const handleSearch = async () => {
    if (!searchTerm) return;
    const res = await axios.get(
      `${API}/api/auth/search?q=${searchTerm}&current=${user.username}`
    );
    setSearchResults(res.data);
  };

  const startChat = (selectedUser) => {
    setTarget(selectedUser.username);
    setSearchTerm("");
    setSearchResults([]);
  };

  if (!user?.username) return null;

  return (
    <div className={dark ? "chat dark" : "chat"}>
      <header>
        <h3>{user.username}</h3>
        <button onClick={() => setDark((prev) => !prev)}>🌙</button>
      </header>

      <div className="search">
        <input
          placeholder="Search user..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>🔍</button>

        {searchResults.length > 0 && (
          <ul className="search-results">
            {searchResults.map((u) => (
              <li key={u.username} onClick={() => startChat(u)}>
                <img src={u.avatar} alt="avatar" />
                {u.username}
              </li>
            ))}
          </ul>
        )}
      </div>

      {target && <p className="chatting-with">Chatting with: {target}</p>}
      <ChatBox messages={messages} currentUser={user.username} ref={chatBoxRef} />
      {typingUser && <div className="typing">{typingUser} is typing...</div>}

      <EmojiInput
        text={text}
        setText={setText}
        onSend={send}
        onTyping={handleTyping}
      />
    </div>
  );
}
