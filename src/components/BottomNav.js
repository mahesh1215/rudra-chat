// src/components/BottomNav.js
import React from 'react';
import { Pizza, Gamepad2, Calculator, MessageSquare } from 'lucide-react';
import './BottomNav.css';

/**
 * Material-Style Bottom Navigation
 * Props:
 *  onOpenSwiggy: () => void
 *  onOpenGames:  () => void
 *  onOpenCalc:   () => void
 *  onOpenChats:  () => void
 */
export default function BottomNav({
  onOpenSwiggy,
  onOpenGames,
  onOpenCalc,
  onOpenChats
}) {
  return (
    <nav className="bnav">
      <button className="bnav-item" title="Food"    onClick={onOpenSwiggy}>
        <Pizza size={24} />
        <span>Food</span>
      </button>
      <button className="bnav-item" title="Games"   onClick={onOpenGames}>
        <Gamepad2 size={24} />
        <span>Games</span>
      </button>
      <button className="bnav-item" title="Calculator" onClick={onOpenCalc}>
        <Calculator size={24} />
        <span>Calc</span>
      </button>
      <button className="bnav-item" title="Chats"   onClick={onOpenChats}>
        <MessageSquare size={24} />
        <span>Chats</span>
      </button>
    </nav>
  );
}
