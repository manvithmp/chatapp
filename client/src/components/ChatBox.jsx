
import React from 'react';

export default function ChatBox({ messages, currentUser }) {
  return (
    <div className="chat-box">
      {messages.map((msg, i) => (
        <div key={i} className={`msg ${msg.sender === currentUser ? "me" : ""}`}>
          <img src={msg.avatar} alt="avatar" />
          <span><strong>{msg.sender}</strong>: {msg.content}</span>
        </div>
      ))}
    </div>
  );
}
