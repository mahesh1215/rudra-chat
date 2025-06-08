// src/screens/NicknameScreen.js
import React, { useEffect, useState } from "react";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { signInAnon, db } from "../firebase";

export default function NicknameScreen({ onSet }) {
  const [name,setName] = useState("");
  const [theme,setTheme] = useState("light");

  useEffect(()=>{
    document.documentElement.classList.toggle("dark", theme==="dark");
  },[theme]);

  const handleJoin = async () => {
    if (!name.trim()) return;
    await signInAnon();
    window.userId = crypto.randomUUID().slice(0,8);
    await setDoc(doc(db,"onlineUsers",window.userId), {
      name:name.trim(),
      joinedAt: Date.now()
    });
    window.addEventListener("beforeunload",()=>{
      deleteDoc(doc(db,"onlineUsers",window.userId));
    });
    onSet(name.trim());
  };

  return (
    <div className={`min-h-screen flex items-center justify-center 
      transition-colors ${theme==="light"
        ? "bg-gradient-to-br from-green-100 via-blue-100 to-purple-200"
        : "bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950"}`}>
      <div className="w-80 bg-white/90 dark:bg-slate-800/90 rounded-3xl shadow-2xl p-8">
        <h1 className="font-bold text-2xl text-center text-blue-700 dark:text-blue-300 mb-6">
          Sri Rudra Chat
        </h1>
        <input
          value={name}
          onChange={e=>setName(e.target.value)}
          placeholder="Nickname..."
          className="w-full border rounded px-3 py-2 mb-4 dark:bg-slate-700 dark:border-slate-600"
        />
        <button onClick={handleJoin}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold">
          Join Chat
        </button>
        <button onClick={()=>setTheme(t=>t==="light"?"dark":"light")}
                className="w-full mt-3 py-1 rounded bg-gray-200 dark:bg-slate-700 text-xs">
          {theme==="light" ? "Dark theme" : "Light theme"}
        </button>
      </div>
    </div>
  );
}
