"use client";

import React from "react";
import { create, all } from "mathjs";
// create() returns a mathjs instance; keep it loose to avoid TS friction
const math: any = create(all, {});

const basicKeys = [
  { label: "7", value: "7" },
  { label: "8", value: "8" },
  { label: "9", value: "9" },
  { label: "÷", value: "/" },
  { label: "4", value: "4" },
  { label: "5", value: "5" },
  { label: "6", value: "6" },
  { label: "×", value: "*" },
  { label: "1", value: "1" },
  { label: "2", value: "2" },
  { label: "3", value: "3" },
  { label: "-", value: "-" },
  { label: "0", value: "0" },
  { label: ".", value: "." },
  { label: "%", value: "%" },
  { label: "+", value: "+" },
];

const scientificKeys = [
  { label: "sin", value: "sin(" },
  { label: "cos", value: "cos(" },
  { label: "tan", value: "tan(" },
  { label: "log", value: "log10(" },
  { label: "ln", value: "log(" },
  { label: "√", value: "sqrt(" },
  { label: "x²", value: "^2" },
  { label: "xʸ", value: "^" },
  { label: "π", value: "pi" },
  { label: "e", value: "e" },
  { label: "(", value: "(" },
  { label: ")", value: ")" },
];

export function CalculatorApp() {
  const [expression, setExpression] = React.useState("0");
  const [error, setError] = React.useState<string | null>(null);

  const append = (value: string) => {
    setError(null);
    setExpression((prev) => (prev === "0" && !value.match(/[\^%\/*+\-)]/) ? value : prev + value));
  };

  const clear = () => {
    setError(null);
    setExpression("0");
  };

  const backspace = () => {
    setError(null);
    setExpression((prev) => {
      if (prev.length <= 1) return "0";
      return prev.slice(0, -1);
    });
  };

  const evaluateExpression = () => {
    try {
      const result = math.evaluate(expression);
      setExpression(String(result));
      setError(null);
    } catch (err) {
      setError("Invalid expression");
    }
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="space-y-1">
        <p className="text-sm text-gray-400">Calculator</p>
        <div className="rounded-lg border border-white/10 bg-black/50 p-4 text-right text-3xl text-white shadow-inner min-h-[72px]">
          {expression}
        </div>
        {error ? <p className="text-xs text-red-400">{error}</p> : null}
      </div>

      <div className="grid grid-cols-4 gap-2 text-sm">
        <button onClick={clear} className="col-span-2 rounded-lg bg-red-500/20 border border-red-500/30 text-white py-2 hover:bg-red-500/30 transition">C</button>
        <button onClick={backspace} className="rounded-lg bg-white/10 border border-white/15 text-white py-2 hover:bg-white/15 transition">⌫</button>
        <button onClick={() => append("(")} className="rounded-lg bg-white/10 border border-white/15 text-white py-2 hover:bg-white/15 transition">(</button>
        {basicKeys.map((key) => (
          <button
            key={key.label}
            onClick={() => append(key.value)}
            className="rounded-lg bg-white/10 border border-white/15 text-white py-3 hover:bg-white/15 transition"
          >
            {key.label}
          </button>
        ))}
        <button onClick={evaluateExpression} className="col-span-2 rounded-lg bg-cyan-500/80 border border-cyan-400/60 text-black font-semibold py-3 hover:bg-cyan-400 transition">
          =
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 text-xs mt-2">
        {scientificKeys.map((key) => (
          <button
            key={key.label}
            onClick={() => append(key.value)}
            className="rounded-lg bg-white/5 border border-white/10 text-white py-2 hover:bg-white/10 transition"
          >
            {key.label}
          </button>
        ))}
      </div>
    </div>
  );
}
