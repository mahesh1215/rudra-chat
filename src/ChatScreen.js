// Sri Rudra Chat - Modern UI ChatScreen
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Image as ImageIcon, Sun, Moon } from "lucide-react";

// You can replace this users object and DUMMY_MESSAGES with your actual data later.
const users = {
  "Mahesh": { avatar: null, color: "bg-blue-500" },
  "Kumar": { avatar: null, color: "bg-pink-500" },
};

const getInitials = name =>
  name
    .split(" ")
    .map(n => n[0].toUpperCase())
    .join("");

const DUMMY_MESSAGES = [
  { user: "Mahesh", text: "Hi Kumar! 👋", ts: "9:47 PM" },
  { user: "Kumar", text: "Hello Mahesh! 😃", ts: "9:48 PM" },
];

export default function ChatScreen() {
  const [theme, setTheme] = useState("light");
  const [messages, setMessages] = useState(DUMMY_MESSAGES);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        user: "Mahesh",
        text: input,
        ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-start
      ${theme === "light"
        ? "bg-gradient-to-br from-blue-200 via-sky-100 to-purple-100"
        : "bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950"}
      transition-colors duration-500
    `}>
      {/* Header */}
      <motion.header
        layout
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md rounded-b-2xl bg-white/90 dark:bg-slate-800/90 shadow-xl flex items-center justify-between px-5 py-4 backdrop-blur"
      >
        <div className="flex items-center gap-2">
          <span className="bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl px-3 py-2 text-white font-extrabold text-2xl shadow">
            S
          </span>
          <div>
            <h1 className="font-bold text-xl text-blue-700 dark:text-blue-300 drop-shadow">
              Sri Rudra Chat
            </h1>
            <span className="text-xs text-gray-400 dark:text-gray-300">Cinematic Messenger</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {/* Online Users */}
          <span className="text-sm text-green-600 font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> 2 Online
          </span>
          {/* Theme Switcher */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="ml-3 rounded-full p-2 bg-gray-100 hover:bg-blue-200 dark:bg-gray-700 dark:hover:bg-blue-900 transition"
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon className="w-5 h-5 text-blue-800" /> : <Sun className="w-5 h-5 text-yellow-300" />}
          </button>
        </div>
      </motion.header>

      {/* Chat Area */}
      <div className="w-full max-w-md flex-1 flex flex-col py-4 px-2 overflow-y-auto">
        <AnimatePresence initial={false}>
          {messages.map((msg, idx) => {
            const isMe = msg.user === "Mahesh";
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
                className={`flex mb-2 items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
              >
                {/* Avatar */}
                {!isMe && (
                  <div className={`w-9 h-9 rounded-full ${users[msg.user]?.color || "bg-slate-400"} flex items-center justify-center shadow`}>
                    {users[msg.user]?.avatar ? (
                      <img src={users[msg.user].avatar} alt={msg.user} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-bold">{getInitials(msg.user)}</span>
                    )}
                  </div>
                )}
                {/* Chat bubble */}
                <div className={`
                  max-w-[75%] px-4 py-2 rounded-2xl shadow
                  text-base font-medium break-words
                  ${isMe
                    ? "bg-gradient-to-br from-blue-400 to-cyan-300 text-white rounded-br-md"
                    : "bg-white dark:bg-slate-700 text-gray-800 dark:text-white rounded-bl-md"
                  }
                  animate-pulse
                `}>
                  {msg.text}
                  <div className="text-xs text-right text-gray-400 mt-1">{msg.ts}</div>
                </div>
                {/* My avatar */}
                {isMe && (
                  <div className={`w-9 h-9 rounded-full ${users[msg.user]?.color || "bg-blue-500"} flex items-center justify-center shadow`}>
                    {users[msg.user]?.avatar ? (
                      <img src={users[msg.user].avatar} alt={msg.user} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <span className="text-white font-bold">{getInitials(msg.user)}</span>
                    )}
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={messagesEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="w-full max-w-md px-2 pb-4">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg px-4 py-2">
          {/* Emoji Picker (placeholder) */}
          <button className="text-gray-500 hover:text-blue-500">
            <Smile className="w-6 h-6" />
          </button>
          {/* Image Upload (placeholder) */}
          <button className="text-gray-500 hover:text-blue-500">
            <ImageIcon className="w-6 h-6" />
          </button>
          {/* Input */}
          <input
            className="flex-1 bg-transparent outline-none px-3 py-2 text-base"
            type="text"
            placeholder="Type a message…"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {/* Send Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            className="rounded-full p-2 bg-blue-500 hover:bg-blue-700 transition text-white shadow-lg"
            aria-label="Send"
          >
            <svg width={20} height={20} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M4 20l16-8-16-8v6l10 2-10 2z" />
            </svg>
          </motion.button>
        </div>
      </div>
    </div>
  );
}
