"use client";

import React from "react";
import Image from "next/image";
import { shadows } from "@/styles/shadows";
import { COMPLETE_BUTTON_CLASSES, DELETE_BUTTON_CLASSES } from "@/styles/button";

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
        className={COMPLETE_BUTTON_CLASSES}
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
        className={DELETE_BUTTON_CLASSES}
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
