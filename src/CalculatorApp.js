import React, { useState } from "react";
export default function CalculatorApp() {
  const [expr, setExpr] = useState("");
  const [result, setResult] = useState("");
  const handleClick = (v) => setExpr(expr + v);
  const handleEval = () => {
    try {
      setResult(eval(expr));
    } catch {
      setResult("Error");
    }
  };
  return (
    <div style={{ width: 220, margin: "0 auto" }}>
      <input value={expr} readOnly style={{width: "100%", marginBottom: 6, fontSize: 20, textAlign: "right"}} />
      <div style={{display: "flex", flexWrap: "wrap"}}>
        {["7","8","9","/","4","5","6","*","1","2","3","-","0",".","+","="].map(v => (
          <button
            key={v}
            onClick={v === "=" ? handleEval : () => handleClick(v)}
            style={{
              width: "25%", padding: 8, fontSize: 20, margin: 2,
              background: "#f3f3f3", border: "1px solid #eee", borderRadius: 6,
            }}>
            {v}
          </button>
        ))}
      </div>
      <div style={{marginTop: 10, fontWeight: 600}}>Result: {result}</div>
    </div>
  );
}
