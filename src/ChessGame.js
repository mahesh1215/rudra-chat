// src/ChessGame.js
import React, { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";

export default function ChessGame() {
  const [game]        = useState(() => new Chess());
  const [position, setPosition] = useState(game.fen());
  const [thinking, setThinking] = useState(false);
  const engineRef     = useRef(null);

  // helper: only add promotion when a pawn reaches final rank
  function makeMoveObj(from, to) {
    const moves = game.moves({ verbose: true });
    // look for matching move
    const valid = moves.find(m => m.from === from && m.to === to);
    if (!valid) return null;
    // if it’s a pawn promotion, include promotion:
    return valid.promotion
      ? { from, to, promotion: valid.promotion }
      : { from, to };
  }

  useEffect(() => {
    const engine = new Worker(`${process.env.PUBLIC_URL}/stockfish.js`);
    engine.onmessage = e => {
      const line = typeof e.data === "string" ? e.data : String(e.data);
      if (line.startsWith("bestmove")) {
        const [, mv] = line.split(" ");
        const from = mv.slice(0,2), to = mv.slice(2,4);
        game.move(makeMoveObj(from, to));
        setPosition(game.fen());
        setThinking(false);
      }
    };
    engine.postMessage("uci");
    engineRef.current = engine;
    return () => engine.terminate();
  }, [game]);

  const onDrop = ({ sourceSquare, targetSquare }) => {
    const moveObj = makeMoveObj(sourceSquare, targetSquare);
    if (!moveObj) return false;    // illegal
    game.move(moveObj);
    setPosition(game.fen());

    setThinking(true);
    engineRef.current.postMessage(`position fen ${game.fen()}`);
    engineRef.current.postMessage("go depth 15");
    return true;
  };

  return (
    <div className="flex flex-col items-center p-4">
      <Chessboard
        position={position}
        onPieceDrop={onDrop}
        boardWidth={350}
      />
      <div className="mt-2 text-sm italic">
        {thinking ? "Stockfish is thinking…" : "Your move."}
      </div>
    </div>
  );
}
