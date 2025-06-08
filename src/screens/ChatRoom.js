// src/screens/ChatRoom.js
import React, { useEffect, useRef, useState } from "react";
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../firebase";
import Avatar from "../components/Avatar";
import IconBtn from "../components/IconBtn";
import EmojiPicker from "emoji-picker-react";
import AskSriRudraBot from "../AskSriRudraBot";

export default function ChatRoom({
  nickname, roomId, roomTitle,
  leaveRoom, onLogout,
  setShowCalc, setShowLudo
}) {
  const [messages,setMessages] = useState([]);
  const [online,setOnline]     = useState([]);
  const [text,setText]         = useState("");
  const [theme,setTheme]       = useState("light");
  const [showEmoji,setShowEmoji] = useState(false);
  const [showAI,setShowAI]       = useState(false);

  const fileInput = useRef();
  const dummy     = useRef();

  useEffect(()=>{
    document.documentElement.classList.toggle("dark", theme==="dark");
  },[theme]);

  useEffect(()=>{
    const q = query(collection(db,"rooms",roomId,"messages"),orderBy("createdAt"));
    return onSnapshot(q,snap=>{
      setMessages(snap.docs.map(d=>({id:d.id,...d.data()})));
      setTimeout(()=>dummy.current?.scrollIntoView({behavior:"smooth"}),50);
    });
  },[roomId]);

  useEffect(()=>{
    const unsub = onSnapshot(collection(db,"onlineUsers"),snap=>{
      setOnline(snap.docs.map(d=>d.data().name));
    });
    return unsub;
  },[]);

  const sendText = async e=>{
    e.preventDefault();
    if (!text.trim()) return;
    await addDoc(collection(db,"rooms",roomId,"messages"),{
      name:nickname,text, image:"",
      createdAt:serverTimestamp(), uid:window.userId
    });
    setText(""); setShowEmoji(false);
  };

  const sendImage = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const imageRef = ref(storage, `images/${Date.now()}-${file.name}`);
    await uploadBytes(imageRef,file);
    const url = await getDownloadURL(imageRef);
    await addDoc(collection(db,"rooms",roomId,"messages"),{
      name:nickname,text:"",image:url,
      createdAt:serverTimestamp(), uid:window.userId
    });
  };

  const ChatBubble = ({msg,me})=>(
    <div className={`flex ${me?"justify-end":"justify-start"} mb-3`}>
      {!me&&<Avatar name={msg.name}/>}
      <div className={`
        px-4 py-2 rounded-2xl max-w-[70%] shadow
        ${me
          ?"bg-gradient-to-br from-blue-400 to-cyan-300 text-white rounded-br-md"
          :"bg-white/90 dark:bg-slate-700 dark:text-white rounded-bl-md"}`}>
        <div className="text-xs font-semibold mb-1">{msg.name}</div>
        {msg.text&&<p>{msg.text}</p>}
        {msg.image&&<img src={msg.image} alt="" className="mt-1 rounded max-h-40"/>}
      </div>
      {me&&<Avatar name={msg.name}/>}
    </div>
  );

  return (
    <div className={`min-h-screen flex flex-col items-center
      ${theme==="light"
        ?"bg-gradient-to-br from-green-100 via-blue-100 to-purple-200"
        :"bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950"}`}>
      <header className="w-full max-w-md bg-white/90 dark:bg-slate-800/90 
                         rounded-b-2xl shadow-xl backdrop-blur px-5 py-4 flex justify-between items-center">
        <div className="font-bold truncate">{roomTitle}</div>
        <div className="flex gap-2">
          <IconBtn tip="Swiggy" color="orange" onClick={()=>window.open("https://www.swiggy.com/","_blank")}><Pizza/></IconBtn>
          <IconBtn tip="Ludo" color="blue" onClick={()=>setShowLudo(true)}><Gamepad2/></IconBtn>
          <IconBtn tip="Calc" color="yellow" onClick={()=>setShowCalc(true)}><CalcIcon/></IconBtn>
          <IconBtn tip="AI" color="purple" onClick={()=>setShowAI(true)}><Bot/></IconBtn>
          <IconBtn tip="Theme" onClick={()=>setTheme(t=>t==="light"?"dark":"light")}>
            {theme==="light"?<Moon/>:<Sun/>}
          </IconBtn>
          <button onClick={leaveRoom} className="text-xs bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">Back</button>
          <button onClick={onLogout} className="text-xs bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-200 px-3 py-1 rounded-xl">Logout</button>
        </div>
      </header>

      <div className="w-full max-w-md mt-3 flex flex-wrap gap-2 px-3">
        {online.map(u=>(
          <span key={u} className="bg-green-50 text-green-700 text-xs px-2 py-[2px] rounded-full flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"/> {u}
          </span>
        ))}
      </div>

      <main className="w-full max-w-md flex-1 overflow-y-auto px-3 py-4">
        {messages.map(m=><ChatBubble key={m.id} msg={m} me={m.uid===window.userId}/>)}
        <div ref={dummy}/>
      </main>

      <form onSubmit={sendText} className="w-full max-w-md px-3 pb-5">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-2xl shadow-lg px-4 py-2 relative">
          <button type="button" onClick={()=>setShowEmoji(e=>!e)}>😊</button>
          {showEmoji && (
            <div className="absolute bottom-24 z-[70]">
              <EmojiPicker onEmojiClick={(_,o)=>setText(t=>t+o.emoji)} theme={theme} height={350}/>
            </div>
          )}
          <input className="flex-1 bg-transparent outline-none px-2" placeholder="Type your message…" value={text} onChange={e=>setText(e.target.value)}/>
          <input type="file" accept="image/*" ref={fileInput} className="hidden" onChange={sendImage}/>
          <button type="button" onClick={()=>fileInput.current.click()}>📷</button>
          <button type="submit" className="ml-2 bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-1">Send</button>
        </div>
      </form>

      <AskSriRudraBot open={showAI} onClose={()=>setShowAI(false)} onSmartReply={setText}/>

      <BottomNav
        onOpenSwiggy={()=>window.open("https://www.swiggy.com/","_blank")}
        onOpenGames={()=>setShowLudo(true)}
        onOpenCalc={()=>setShowCalc(true)}
        onOpenChats={leaveRoom}
      />
    </div>
  );
}
