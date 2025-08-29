// components/MessageForm.jsx
import { useState } from "react";

const MessageForm = ({ message, setMessage }) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement message sending logic here
    console.log("Sending message:", message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex items-center">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          rows={4}
          className="flex-1 px-4 py-2 border rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white/50"
        />
      </div>
    </form>
  );
};

export default MessageForm;