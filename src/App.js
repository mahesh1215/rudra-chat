// src/App.js
/*****************************************************************
  Sri-Rudra Chat – all-in-one App.js
  • NicknameScreen → ChatLobby → ChatRoom
  • Shared bottom nav with Swiggy, Games, Calc, Chats
  • Global Calculator & Games picker modals
  • Firebase v9 modular SDK
  • Requires: firebase.js + AskSriRudraBot.js + BottomNav.js/css
 *****************************************************************/
import React, { useEffect, useRef, useState } from "react";
import {
  collection, doc, addDoc, setDoc, deleteDoc,
  query, orderBy, onSnapshot, serverTimestamp
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage, signInAnon } from "./firebase";
import AskSriRudraBot from "./AskSriRudraBot";
import EmojiPicker from "emoji-picker-react";
import {
  Moon, Sun, Bot, Plus,
  Pizza, Gamepad2, Calculator as CalcIcon
} from "lucide-react";

import BottomNav from "./components/BottomNav";
import CalculatorApp from "./CalculatorApp";
import LudoGame from "./LudoGame";
import ChessGame from "./ChessGame";

/* ============ SHARED WIDGETS ============ */
const Avatar = ({ name }) => (
  <div className="w-8 h-8 flex items-center justify-center
                  rounded-full bg-blue-500 text-white font-bold text-sm">
    {name?.[0]?.toUpperCase()}
  </div>
);

const IconBtn = ({ tip, color = "gray", onClick, children }) => {
  const clr = {
    orange: "bg-orange-100 hover:bg-orange-300 text-orange-700",
    blue:   "bg-blue-100   hover:bg-blue-300   text-blue-700",
    yellow: "bg-yellow-100 hover:bg-yellow-300 text-yellow-700",
    purple: "bg-purple-100 hover:bg-purple-300 text-purple-700",
    gray:   "bg-gray-100   hover:bg-gray-300   text-gray-700"
  }[color];
  return (
    <button title={tip} onClick={onClick}
            className={`${clr} p-2 rounded-full shrink-0`}>
      {children}
    </button>
  );
};

/* ============ MODAL (max-w-md) ============ */
const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-[60] p-4">
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl
                    w-full max-w-md max-h-full overflow-auto p-6 text-center">
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

/* ============ NICKNAME SCREEN ============ */
function NicknameScreen({ onSet }) {
  const [name, setName]   = useState("");
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme==="dark");
  }, [theme]);

  const handleJoin = async () => {
    if (!name.trim()) return;
    await signInAnon();
    window.userId = crypto.randomUUID().slice(0,8);
    await setDoc(doc(db,"onlineUsers",window.userId), {
      name:name.trim(),
      joinedAt:Date.now()
    });
    window.addEventListener("beforeunload",
      ()=>deleteDoc(doc(db,"onlineUsers",window.userId)));
    onSet(name.trim());
  };

  return (
    <div className={`
      min-h-screen flex items-center justify-center transition-colors
      ${theme==="light"
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
          className="w-full border rounded px-3 py-2 mb-4
                     dark:bg-slate-700 dark:border-slate-600"
        />
        <button onClick={handleJoin}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700
                           text-white rounded-lg font-semibold">
          Join Chat
        </button>
        <button onClick={()=>setTheme(t=>t==="light"?"dark":"light")}
                className="w-full mt-3 py-1 rounded bg-gray-200
                           dark:bg-slate-700 text-xs">
          {theme==="light" ? "Dark theme" : "Light theme"}
        </button>
      </div>
    </div>
  );
}

/* ============ CHAT LOBBY ============ */
function ChatLobby({
  nickname, enterRoom, onLogout,
  setShowCalc, setShowLudo, onOpenChats
}) {
  const [onlineUsers,setOnlineUsers] = useState([]);
  const [theme,setTheme]             = useState("light");

  useEffect(()=> {
    document.documentElement.classList.toggle("dark", theme==="dark");
  }, [theme]);

  useEffect(()=> {
    const unsub = onSnapshot(collection(db,"onlineUsers"),snap=>{
      const latest = new Map();
      snap.docs.forEach(d=>{
        const u={id:d.id,...d.data()};
        const p=latest.get(u.name);
        if(!p||u.joinedAt>p.joinedAt) latest.set(u.name,u);
      });
      setOnlineUsers(Array.from(latest.values())
        .filter(u=>u.id!==window.userId));
    });
    return unsub;
  }, []);

  const startChat = async other => {
    const docRef = await addDoc(collection(db,"rooms"),{
      title:other.name, createdAt:serverTimestamp(),
      participants:[window.userId,other.id]
    });
    enterRoom(docRef.id,other.name);
  };

  return (
    <div className={`
      min-h-screen flex flex-col items-center pt-24
      ${theme==="light"
        ? "bg-gradient-to-br from-green-100 via-blue-100 to-purple-200"
        : "bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950"}`}>
      <div className="w-full max-w-md bg-white/90 dark:bg-slate-800/90
                      rounded-2xl shadow-xl px-5 py-4 flex justify-between">
        <div className="font-bold text-lg">
          Hello, <span className="text-blue-600">{nickname}</span>
        </div>
        <div className="flex gap-2">
          <IconBtn tip="Theme" onClick={()=>setTheme(t=>t==="light"?"dark":"light")}>
            {theme==="light"?<Moon/>:<Sun/>}
          </IconBtn>
          <button onClick={onLogout}
                  className="text-xs bg-pink-100 dark:bg-pink-900
                             text-pink-600 dark:text-pink-200 px-3 py-1
                             rounded-xl">
            Logout
          </button>
        </div>
      </div>

      <div className="w-full max-w-md mt-6 px-4 space-y-2 flex-1 overflow-auto"
           style={{paddingBottom:"80px"}}>
        {onlineUsers.length===0
          ? <p className="text-center text-gray-500">No one else is online 🙁</p>
          : onlineUsers.map(u=>(
              <button key={u.id} onClick={()=>startChat(u)}
                className="w-full flex items-center gap-3
                           bg-white/80 dark:bg-slate-800/80
                           shadow rounded-xl px-4 py-3
                           hover:bg-blue-50 dark:hover:bg-slate-700">
                <Avatar name={u.name}/>
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
        onOpenChats={onOpenChats}
      />
    </div>
  );
}

/* ============ CHAT ROOM ============ */
function ChatRoom({
  nickname, roomId, roomTitle,
  leaveRoom, onLogout,
  setShowCalc, setShowLudo, onOpenChats
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
    const q = query(collection(db,"rooms",roomId,"messages"),
                    orderBy("createdAt"));
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

  useEffect(()=>{
    document.documentElement.classList.toggle("dark", theme==="dark");
  },[theme]);

  const sendText = async e=>{
    e.preventDefault();
    if(!text.trim()) return;
    await addDoc(collection(db,"rooms",roomId,"messages"),{
      name:nickname, text, image:"",
      createdAt:serverTimestamp(), uid:window.userId
    });
    setText(""); setShowEmoji(false);
  };

  const sendImage = async e => {
    const file = e.target.files[0];
    if (!file) return;
    const imageRef = ref(storage, `images/${Date.now()}-${file.name}`);
    await uploadBytes(imageRef, file);
    const url = await getDownloadURL(imageRef);
    await addDoc(
      collection(db, "rooms", roomId, "messages"),
      {
        name: nickname,
        text: "",
        image: url,
        createdAt: serverTimestamp(),
        uid: window.userId
      }
    );
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

  const doSmartReply = txt=>{ setText(txt); setShowAI(false); };
  const openSwiggy   = ()=>window.open("https://www.swiggy.com/","_blank");

  return (
    <div className={`
      min-h-screen flex flex-col items-center
      ${theme==="light"
        ?"bg-gradient-to-br from-green-100 via-blue-100 to-purple-200"
        :"bg-gradient-to-br from-slate-900 via-blue-950 to-purple-950"}`}>      
      <header className="w-full max-w-md bg-white/90 dark:bg-slate-800/90
                         rounded-b-2xl shadow-xl backdrop-blur px-5 py-4 flex justify-between items-center">
        <div className="font-bold truncate">{roomTitle}</div>
        <div className="flex gap-2">
          <IconBtn tip="Swiggy" color="orange" onClick={openSwiggy}><Pizza/></IconBtn>
          <IconBtn tip="Ludo"   color="blue"   onClick={()=>setShowLudo(true)}><Gamepad2/></IconBtn>
          <IconBtn tip="Calc"   color="yellow" onClick={()=>setShowCalc(true)}><CalcIcon/></IconBtn>
          <IconBtn tip="AI"     color="purple" onClick={()=>setShowAI(true)}><Bot/></IconBtn>
          <IconBtn tip="Theme" onClick={()=>setTheme(t=>t==="light"?"dark":"light")}>
            {theme==="light"?<Moon/>:<Sun/>}
          </IconBtn>
          <button onClick={leaveRoom}
                  className="text-xs bg-gray-200 dark:bg-slate-700 px-2 py-1 rounded">
            Back
          </button>
          <button onClick={onLogout}
                  className="text-xs bg-pink-100 dark:bg-pink-900 text-pink-600
                             dark:text-pink-200 px-3 py-1 rounded-xl">
            Logout
          </button>
        </div>
      </header>

      <div className="w-full max-w-md mt-3 flex flex-wrap gap-2 px-3">
        {online.map(u=>(
          <span key={u}
                className="bg-green-50 text-green-700 text-xs px-2 py-[2px]
                           rounded-full flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-1"/> {u}
          </span>
        ))}
      </div>

      <main className="w-full max-w-md flex-1 overflow-y-auto px-3 py-4">
        {messages.map(m=>(
          <ChatBubble key={m.id} msg={m} me={m.uid===window.userId}/>
        ))}
        <div ref={dummy}/>
      </main>

      <form onSubmit={sendText} className="w-full max-w-md px-3 pb-5">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800
                        rounded-2xl shadow-lg px-4 py-2 relative">
          <button type="button" onClick={()=>setShowEmoji(e=>!e)}>😊</button>
          {showEmoji && (
            <div className="absolute bottom-24 z-[70]">
              <EmojiPicker onEmojiClick={(ev,emoji)=>setText(t=>t+emoji.emoji)}
                           theme={theme} height={350}/>
            </div>
          )}
          <input
            className="flex-1 bg-transparent outline-none px-2"
            placeholder="Type your message…"
            value={text}
            onChange={e=>setText(e.target.value)}
          />
          <input type="file" accept="image/*" ref={fileInput}
                 className="hidden" onChange={sendImage}/>
          <button type="button" onClick={()=>fileInput.current.click()}>📷</button>
          <button type="submit"
                  className="ml-2 bg-green-500 hover:bg-green-600
                             text-white rounded-full px-4 py-1">
            Send
          </button>
        </div>
      </form>

      <AskSriRudraBot open={showAI} onClose={()=>setShowAI(false)}
                      onSmartReply={doSmartReply}/>

      <BottomNav
        onOpenSwiggy={openSwiggy}
        onOpenGames={()=>setShowLudo(true)}
        onOpenCalc={()=>setShowCalc(true)}
        onOpenChats={onOpenChats}
      />
    </div>
  );
}

/* ============ ROOT ============ */
export default function App() {
  const [nick,setNick]         = useState("");
  const [room,setRoom]         = useState(null);
  const [showCalc,setShowCalc] = useState(false);
  const [showLudo,setShowLudo] = useState(false);
  const [selectedGame,setSelectedGame] = useState(null);

  let mainView;
  if (!nick) {
    mainView = <NicknameScreen onSet={setNick}/>;
  } else if (!room) {
    mainView = (
      <ChatLobby
        nickname={nick}
        enterRoom={(id,title)=>setRoom({id,title})}
        onLogout={()=>setNick("")}
        setShowCalc={setShowCalc}
        setShowLudo={setShowLudo}
        onOpenChats={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      />
    );
  } else {
    mainView = (
      <ChatRoom
        nickname={nick}
        roomId={room.id}
        roomTitle={room.title}
        leaveRoom={()=>setRoom(null)}
        onLogout={()=>{setRoom(null);setNick("");}}
        setShowCalc={setShowCalc}
        setShowLudo={setShowLudo}
        onOpenChats={()=>setRoom(null)}
      />
    );
  }

  return (
    <>
      {mainView}

      {/* Global Calculator Modal */}
      {showCalc && (
        <Modal title="Calculator" onClose={()=>setShowCalc(false)}>
          <CalcIcon className="inline-block mr-2"/> <CalculatorApp/>
        </Modal>
      )}

      {/* Global Games Picker Modal */}
      {showLudo && (
        <Modal
          title="Choose a Game"
          onClose={()=>{ setShowLudo(false); setSelectedGame(null); }}
        >
          {!selectedGame ? (
            <div className="flex flex-col gap-4">
              <button onClick={()=>setSelectedGame("ludo")}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Ludo
              </button>
              <button onClick={()=>setSelectedGame("chess")}
                      className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                Chess with AI
              </button>
            </div>
          ) : selectedGame==="ludo" ? (
            <LudoGame/>
          ) : (
            <ChessGame/>
          )}
        </Modal>
      )}
    </>
  );
}
