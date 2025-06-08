// ChatList.js
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { ArrowRight } from "lucide-react";

export default function ChatList({ nickname, enterRoom }) {
  const [chats, setChats] = useState([]);

  // live list of rooms the user is part of
  useEffect(() => {
    const q = query(
      collection(db, "rooms"),
      orderBy("updatedAt", "desc")
    );
    const unsub = onSnapshot(q, snap => {
      setChats(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  async function newChat() {
    const ref = await addDoc(collection(db, "rooms"), {
      title: "New chat",
      createdBy: nickname,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      lastMsg: ""
    });
    enterRoom(ref.id, "New chat");
  }

  return (
    <div className="w-full max-w-md mx-auto py-4">
      <header className="flex items-center justify-between px-4">
        <h2 className="text-2xl font-bold text-blue-700">Sri Rudra Chat</h2>
        <button
          className="flex items-center gap-1 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white"
          onClick={newChat}
        >
          New
          <ArrowRight size={16} />
        </button>
      </header>

      <ul className="mt-4 divide-y">
        {chats.map(c => (
          <li
            key={c.id}
            className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => enterRoom(c.id, c.title)}
          >
            <div>
              <p className="font-semibold">{c.title}</p>
              <p className="text-sm text-gray-500 truncate max-w-[200px]">
                {c.lastMsg || "No messages yet…"}
              </p>
            </div>
            {/* tiny green dot if user is inside that room right now */}
            {c.online?.includes(nickname) && (
              <span className="w-2 h-2 rounded-full bg-green-500" />
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
