// src/LudoGame.js
import React from "react";

export default function LudoGame({ onBack }) {
  return (
    <div className="fixed inset-0 bg-white dark:bg-slate-900 z-[70] flex flex-col">
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start m-4 px-4 py-2 bg-gray-200 dark:bg-slate-700 rounded shadow"
      >
        ← Back to Chat
      </button>

      {/* Embedded Ludo via iframe */}
      <iframe
        src="https://poki.com/en/g/ludo"
        title="Ludo Game"
        allowFullScreen
        className="flex-1 w-full"
        style={{ border: 0 }}
      />
    </div>
  );
}
