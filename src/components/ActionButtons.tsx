"use client";

import React from "react";
import Image from "next/image";
import { shadows } from "@/styles/shadows";

interface ActionButtonsProps {
  onEditComplete?: () => void;
  onDelete?: () => void;
  className?: string;
}

export default function ActionButtons({
  onEditComplete,
  onDelete,
  className = "",
}: ActionButtonsProps) {
  return (
    <div className={`flex gap-3 ${className}`}>
      {/* 수정 완료 버튼 */}
      <button
        onClick={onEditComplete}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-2xl
          bg-lime-400 hover:bg-lime-500
          text-slate-900 font-semibold
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-lime-600
        `}
        style={{ boxShadow: shadows.small }}
      >
        <div className="relative w-5 h-5">
          <Image src="/icons/ic_check.svg" alt="완료" fill className="brightness-0" />
        </div>
        수정 완료
      </button>

      {/* 삭제하기 버튼 */}
      <button
        onClick={onDelete}
        className={`
          flex items-center gap-2 px-6 py-3 rounded-2xl
          bg-red-500 hover:bg-red-600
          text-white font-semibold
          transition-colors duration-200
          focus:outline-none focus:ring-2 focus:ring-red-600
        `}
        style={{ boxShadow: shadows.small }}
      >
        <div className="relative w-5 h-5">
          <Image src="/icons/ic_x.svg" alt="삭제" fill className="brightness-0 invert" />
        </div>
        삭제하기
      </button>
    </div>
  );
}
