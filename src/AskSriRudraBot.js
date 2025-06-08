import React, { useState, useEffect } from "react";

/**
 * AskSriRudraBot – simple AI reply modal
 */
export default function AskSriRudraBot({ open, onClose, onSmartReply }) {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");

  // If you had instantiated a third-party picker, guard its destroy here.
  useEffect(() => {
    // const picker = new SomePicker(...);
    return () => {
      // if (picker && typeof picker.destroy === "function") {
      //   picker.destroy();
      // }
    };
  }, []);

  const handleAsk = () => {
    if (!input.trim()) return;
    // dummy smart replies
    const choices = [
      "Try sending a friendly emoji 😊",
      "Ask them how their day is going!",
      "Share a fun fact.",
      "Respond with a compliment."
    ];
    const smart = choices[Math.floor(Math.random() * choices.length)];
    setReply(smart);
    onSmartReply?.(smart);
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 w-80 shadow-xl">
        <h2 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-4">
          Ask Sri Rudra AI
        </h2>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask for a smart reply..."
          className="w-full border rounded px-3 py-2 mb-3 dark:bg-slate-700 dark:border-slate-600"
        />
        <div className="flex gap-2">
          <button
            onClick={handleAsk}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white rounded py-1"
          >
            Ask
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-200 dark:bg-slate-600 rounded py-1"
          >
            Close
          </button>
        </div>
        {reply && (
          <div className="mt-4 p-3 bg-blue-50 dark:bg-slate-700 rounded text-sm text-blue-900 dark:text-blue-200">
            {reply}
          </div>
        )}
      </div>
    </div>
  );
}
