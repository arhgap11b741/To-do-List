import React from "react";
import Image from "next/image";
import { shadows } from "@/styles/shadows";

interface AddButtonProps {
  isEmpty?: boolean;
  onClick?: () => void;
  className?: string;
}

export default function AddButton({ isEmpty = false, onClick, className = "" }: AddButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        relative inline-flex items-center justify-center gap-2 rounded-full
        transition-all duration-200 ease-in-out
        hover:opacity-80 active:scale-95
        border-2 border-slate-900
        ${isEmpty ? "bg-violet-600 hover:bg-violet-700" : "bg-slate-200 hover:bg-slate-300"}
        w-14 h-14 md:w-[168px] md:h-14
        ${className}
      `}
      style={{
        boxShadow: shadows.default,
      }}
      aria-label="할 일 추가"
    >
      <div className="relative w-3 h-3">
        <Image
          src="/icons/ic_plus,small.svg"
          alt="추가"
          fill
          className={isEmpty ? "brightness-0 invert" : "brightness-0"}
        />
      </div>
      <span
        className={`hidden md:block font-bold text-base ${isEmpty ? "text-white" : "text-slate-900"}`}
      >
        추가하기
      </span>
    </button>
  );
}
