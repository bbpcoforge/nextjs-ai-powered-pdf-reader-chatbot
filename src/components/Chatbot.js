"use client";

import React, { useState, useEffect } from "react";
import { getAnswer } from "@/app/lib/actions";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (message) => {
    setIsLoading(true);

    const response = await getAnswer(message);
    setMessages([
      ...messages,
      { user: true, text: response.question },
      { user: false, text: response.answer.text },
    ]);
    /*
    setMessages([
      ...messages,
      { user: true, text: message },
      {
        user: false,
        text: "All birds find the shwelter during a rain. But eagle avoids rain by flying above the clouds.",
      },
    ]);
    */
    setUserInput("");
    setIsLoading(false);
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };
  const handleKeyPress = (event) => {
    if (event.key === "Enter" && userInput.trim() !== "") {
      sendMessage(userInput);
    }
  };
  useEffect(() => {
    // Fetch initial messages from API if needed
    // ...
  }, []);

  return (
    <div className="chatbot-container flex flex-col h-[40rem] md:h-screen md:w-1/2 bg-gray-200 dark:bg-gray-800">
      <div className="chat-history flex-grow overflow-auto p-4">
        {messages.length === 0 && (
          <div className="text-center text-4xl text-gray-600 mt-4">
            How can I help you today?
          </div>
        )}
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.user
                ? "from-user bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white"
                : "from-bot bg-blue-100 text-blue-800"
            } p-2 rounded-lg mb-2 text-justify`}
          >
            {message.text}
          </div>
        ))}
        {isLoading && <div className="text-center mt-4">Loading...</div>}
      </div>
      <div className="chat-input flex px-4 py-6 border-t border-gray-400 dark:border-gray-600">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          onKeyUp={handleKeyPress}
          className="flex-grow rounded-3xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 dark:bg-gray-900 text-gray-600 dark:text-white"
          placeholder="Enter a prompt here"
        />
        <button
          disabled={isLoading || userInput.trim() === ""}
          onClick={() => sendMessage(userInput)}
          className="rounded-3xl ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 shadow-sm"
        >
          Send
        </button>
      </div>
    </div>
  );
}
