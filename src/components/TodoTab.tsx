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
  variant?: "list" | "detail"; // list: 목록 화면, detail: 상세 화면
  clickable?: boolean; // 텍스트 클릭 시 상세 페이지로 이동 여부
}

export default function TodoTab({
  id,
  text,
  completed = false,
  onToggle,
  className = "",
  variant = "list",
  clickable = true,
}: TodoTabProps) {
  const router = useRouter();

  const handleToggle = () => {
    const newState = !completed;
    onToggle?.(newState);
  };

  const handleTextClick = () => {
    if (clickable) {
      router.push(`/items/${id}`);
    }
  };

  // 스타일 설정 (variant와 관계없이 동일)
  const bgColor = completed ? "bg-violet-100" : "bg-white";
  const textColor = "text-slate-800";

  // 미완료 상태 체크 버튼 (항상 노란색 원)
  const checkButtonUncompleted = (
    <div className="w-7 h-7 rounded-full bg-yellow-50 border-2 border-slate-900" />
  );

  // 완료 상태 텍스트 스타일 (variant에 따라 다름)
  const completedTextStyle = variant === "detail" ? "underline" : "line-through";

  return (
    <div
      className={`
        relative w-full h-12 md:h-14 rounded-full
        ${bgColor}
        border-2 border-slate-900
        transition-colors duration-200
        ${variant === "detail" ? "flex items-center justify-center" : ""}
        ${className}
      `}
      style={{
        boxShadow: shadows.small,
      }}
    >
      {variant === "detail" ? (
        // 디테일 페이지: 가운데 정렬
        <>
          {/* 체크 버튼 */}
          <button
            onClick={handleToggle}
            className="focus:outline-none focus:ring-2 focus:ring-violet-600 rounded-full transition-all duration-200 hover:scale-110 mr-3"
            aria-label={completed ? "완료 취소" : "완료 표시"}
          >
            {completed ? (
              // 완료 상태: 보라색 원 + 체크마크
              <div className="relative w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
                <div className="relative w-4 h-4">
                  <Image
                    src="/icons/ic_check.svg"
                    alt="완료"
                    fill
                    className="brightness-0 invert"
                  />
                </div>
              </div>
            ) : (
              // 미완료 상태
              checkButtonUncompleted
            )}
          </button>

          {/* 텍스트 */}
          <div
            onClick={handleTextClick}
            className={`${clickable ? "cursor-pointer hover:opacity-80" : ""} transition-opacity`}
          >
            <p
              className={`text-sm md:text-base font-medium ${textColor} transition-all duration-200 ${
                completed ? `${completedTextStyle} opacity-70` : ""
              }`}
            >
              {text}
            </p>
          </div>
        </>
      ) : (
        // 목록 페이지: 기존 레이아웃
        <>
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
                  <Image
                    src="/icons/ic_check.svg"
                    alt="완료"
                    fill
                    className="brightness-0 invert"
                  />
                </div>
              </div>
            ) : (
              // 미완료 상태: variant에 따라 다른 스타일
              checkButtonUncompleted
            )}
          </button>

          {/* 텍스트 */}
          <div
            onClick={handleTextClick}
            className={`absolute left-14 md:left-16 top-1/2 -translate-y-1/2 right-6 ${
              clickable ? "cursor-pointer hover:opacity-80" : ""
            } transition-opacity`}
          >
            <p
              className={`text-sm md:text-base font-medium ${textColor} truncate transition-all duration-200 ${
                completed ? `${completedTextStyle} opacity-70` : ""
              }`}
            >
              {text}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
