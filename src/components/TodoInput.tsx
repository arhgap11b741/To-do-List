"use client";

import React, { useState } from "react";
import AddButton from "./AddButton";
import { shadows } from "@/styles/shadows";

interface TodoInputProps {
  onAdd?: (text: string) => void;
  className?: string;
}

export default function TodoInput({ onAdd, className = "" }: TodoInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    if (inputValue.trim()) {
      onAdd?.(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAdd();
    }
  };

  return (
    <div className={`flex items-center gap-4 w-auto ${className}`}>
      <div
        className="relative flex-1 min-w-0 rounded-full"
        style={{
          boxShadow: shadows.default,
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="할 일을 입력해주세요"
          className="w-full h-12 md:h-14 px-6 rounded-full bg-slate-100 border-2 border-slate-900
                     text-slate-900 placeholder:text-slate-400
                     focus:outline-none focus:ring-2 focus:ring-violet-600 focus:border-violet-600
                     transition-all duration-200"
        />
      </div>
      <AddButton isEmpty={!inputValue.trim()} onClick={handleAdd} className="flex-shrink-0" />
    </div>
  );
}
