// src/screens/ChatLobby.js
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import Avatar from "../components/Avatar";
import IconBtn from "../components/IconBtn";

export default function ChatLobby({ nickname, enterRoom, onLogout, setShowCalc, setShowLudo }) {
  const [users,setUsers] = useState([]);
  const [theme,setTheme] = useState("light");

  useEffect(()=>{
    document.documentElement.classList.toggle("dark", theme==="dark");
  },[theme]);

  useEffect(()=>{
    const unsub = onSnapshot(collection(db,"onlineUsers"),snap=>{
      const latest = new Map();
      snap.docs.forEach(d=>{
        const u = { id:d.id, ...d.data() };
        const p = latest.get(u.name);
        if (!p||u.joinedAt>p.joinedAt) latest.set(u.name,u);
      });
      setUsers(Array.from(latest.values()).filter(u=>u.id!==window.userId));
    });
    return unsub;
  },[]);

  const startChat = async u=>{
    const docRef = await addDoc(collection(db,"rooms"),{
      title:u.name,createdAt:serverTimestamp(),
      participants:[window.userId,u.id]
    });
    enterRoom(docRef.id,u.name);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center pt-24 
      ${theme==="light"
        ? "bg-gradient-to-br from-green-100 via-blue-100 to-purple-200"
        : "bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950"}`}>
      <header className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 rounded-2xl 
                         shadow-xl px-5 py-4 flex justify-between">
        <div className="font-bold text-lg">
          Hello, <span className="text-blue-600">{nickname}</span>
        </div>
        <div className="flex gap-2">
          <IconBtn tip="Theme" onClick={()=>setTheme(t=>t==="light"?"dark":"light")}>
            {theme==="light"?<Moon/>:<Sun/>}
          </IconBtn>
          <button onClick={onLogout}
                  className="text-xs bg-pink-100 dark:bg-pink-900 
                             text-pink-600 dark:text-pink-200 px-3 py-1 rounded-xl">
            Logout
          </button>
        </div>
      </header>

      <div className="w-full max-w-md mt-6 px-4 space-y-2 flex-1 overflow-auto"
           style={{paddingBottom: "80px"}}>
        {users.length===0
          ? <p className="text-center text-gray-500">No one else is online 🙁</p>
          : users.map(u=>(
              <button key={u.id} onClick={()=>startChat(u)}
                className="w-full flex items-center gap-3 bg-white/80 dark:bg-slate-800/80 
                           shadow rounded-xl px-4 py-3 hover:bg-blue-50 dark:hover:bg-slate-700">
                <Avatar name={u.name} />
                <span className="flex-1 text-left">{u.name}</span>
                <span className="text-xs text-green-600">Online</span>
              </button>
            ))
        }
      </div>

      <BottomNav
        onOpenSwiggy={()=>window.open("https://www.swiggy.com/","_blank")}
        onOpenGames={()=>setShowLudo(true)}
        onOpenCalc={()=>setShowCalc(true)}
        onOpenChats={()=>{}}
      />
    </div>
  );
}
