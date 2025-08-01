import React, { useState, useRef, useEffect } from "react";
import EmojiPicker from "emoji-picker-react";

export default function EmojiInput({ text, setText, onSend, onTyping }) {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);

  const handleEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target)
      ) {
        setShowPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="emoji-input">
      <div className="input-row">
        <button
          onClick={() => setShowPicker((prev) => !prev)}
          className="emoji-toggle"
        >
          😊
        </button>

        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping();
          }}
          placeholder="Type a message..."
        />

        <button onClick={onSend}>Send</button>
      </div>

      {showPicker && (
        <div className="emoji-picker" ref={pickerRef}>
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
}
