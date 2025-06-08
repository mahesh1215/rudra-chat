import React from "react";

export default function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-lg max-h-full overflow-auto p-6 text-center">
        <h3 className="font-bold text-xl mb-4">{title}</h3>
        {children}
        {onClose && (
          <button onClick={onClose}
                  className="mt-4 px-4 py-1 bg-gray-200 dark:bg-slate-700 rounded">
            Close
          </button>
        )}
      </div>
    </div>
  );
}
