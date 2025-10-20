"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { shadows } from "@/styles/shadows";

interface TodoTabProps {
  id: string;
  text: string;
  completed?: boolean;
  onToggle?: (isCompleted: boolean) => void;
  className?: string;
}

export default function TodoTab({
  id,
  text,
  completed = false,
  onToggle,
  className = "",
}: TodoTabProps) {
  const router = useRouter();

  const handleToggle = () => {
    const newState = !completed;
    onToggle?.(newState);
  };

  const handleTextClick = () => {
    router.push(`/items/${id}`);
  };

  return (
    <div
      className={`
        relative w-full h-12 md:h-14 rounded-full
        ${completed ? "bg-violet-100" : "bg-white"}
        border-2 border-slate-900
        transition-colors duration-200
        ${className}
      `}
      style={{
        boxShadow: shadows.small,
      }}
    >
      {/* 왼쪽 체크 버튼 */}
      <button
        onClick={handleToggle}
        className="absolute left-3 top-1/2 -translate-y-1/2 focus:outline-none focus:ring-2 focus:ring-violet-600 rounded-full transition-all duration-200 hover:scale-110"
        aria-label={completed ? "완료 취소" : "완료 표시"}
      >
        {completed ? (
          // 완료 상태: 보라색 원 + 체크마크
          <div className="relative w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
            <div className="relative w-4 h-4">
              <Image src="/icons/ic_check.svg" alt="완료" fill className="brightness-0 invert" />
            </div>
          </div>
        ) : (
          // 미완료 상태: 노란색 원
          <div className="w-7 h-7 rounded-full bg-yellow-50 border-2 border-slate-900" />
        )}
      </button>

      {/* 텍스트 */}
      <div
        onClick={handleTextClick}
        className="absolute left-14 md:left-16 top-1/2 -translate-y-1/2 right-6 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <p
          className={`text-sm md:text-base font-medium text-slate-800 truncate transition-all duration-200 ${
            completed ? "line-through opacity-70" : ""
          }`}
        >
          {text}
        </p>
      </div>
    </div>
  );
}
