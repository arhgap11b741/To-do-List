"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { shadows } from "@/styles/shadows";
import ActionButtons from "@/components/ActionButtons";

// Todo 데이터 타입 정의
interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

// 하드코딩된 Todo 데이터 (실제 앱에서는 전역 상태나 API에서 가져옴)
const todoData: TodoItem[] = [];

export default function TodoDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [memo, setMemo] = useState("오메가 3, 프로폴리스, 아연 챙겨먹기");
  const [isImageUploaded, setIsImageUploaded] = useState(true);

  // 해당 ID에 맞는 Todo 항목 찾기
  const currentTodo = todoData.find((todo) => todo.id === params.id);

  // Todo가 존재하지 않으면 404 처리
  if (!currentTodo) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">할 일을 찾을 수 없습니다</h1>
          <button
            onClick={() => router.back()}
            className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  const handleEditComplete = () => {
    // 수정 완료 로직
    console.log("수정 완료");
  };

  const handleDelete = () => {
    // 삭제 로직
    console.log("삭제하기");
    router.back();
  };

  return (
    <div className="bg-white rounded-xl p-6 md:p-12 my-6 md:my-12">
      {/* 헤더 */}
      <div className="flex items-center gap-3 mb-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-700 hover:text-slate-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">뒤로 가기</span>
        </button>
      </div>

      {/* 상세 페이지 헤더 */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">상세 페이지 - 활성화</h1>

        {/* TodoTab 헤더 */}
        <div
          className={`relative w-full h-12 md:h-14 rounded-full border-2 border-slate-900 flex items-center ${
            currentTodo.completed ? "bg-violet-100" : "bg-violet-600"
          }`}
          style={{ boxShadow: shadows.small }}
        >
          {/* 체크 버튼 */}
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {currentTodo.completed ? (
              <div className="w-8 h-8 rounded-full bg-violet-600 flex items-center justify-center">
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
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <div className="relative w-4 h-4">
                  <Image src="/icons/ic_check.svg" alt="완료" fill className="brightness-0" />
                </div>
              </div>
            )}
          </div>

          {/* 텍스트 */}
          <div className="absolute left-14 md:left-16 top-1/2 -translate-y-1/2 right-6">
            <p
              className={`text-sm md:text-base font-medium truncate ${
                currentTodo.completed ? "text-slate-800 line-through opacity-70" : "text-white"
              }`}
            >
              {currentTodo.text}
            </p>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 이미지 영역 */}
        <div
          className="bg-white rounded-2xl p-6 border-2 border-slate-900 relative"
          style={{ boxShadow: shadows.small }}
        >
          <div className="aspect-square bg-yellow-100 rounded-xl border-2 border-dashed border-yellow-300 relative overflow-hidden">
            {isImageUploaded ? (
              <>
                {/* 기본 이미지 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-48 h-48 md:w-64 md:h-64">
                    <Image
                      src="/images/img_detail.svg"
                      alt="상세 이미지"
                      fill
                      className="object-contain opacity-60"
                    />
                  </div>
                </div>

                {/* 편집 버튼 */}
                <button
                  onClick={() => setIsImageUploaded(false)}
                  className="absolute bottom-4 right-4 w-10 h-10 bg-slate-700 rounded-full border-2 border-slate-900 flex items-center justify-center hover:bg-slate-600 transition-colors"
                  style={{ boxShadow: shadows.small }}
                >
                  <div className="relative w-5 h-5">
                    <Image
                      src="/icons/ic_edit.svg"
                      alt="편집"
                      fill
                      className="brightness-0 invert"
                    />
                  </div>
                </button>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center h-full p-8">
                  <div className="relative w-16 h-16 mb-4">
                    <Image
                      src="/icons/ic_plus,large.svg"
                      alt="이미지 추가"
                      fill
                      className="brightness-0 opacity-50"
                    />
                  </div>
                  <p className="text-slate-500 text-center">
                    이미지를 추가하려면
                    <br />
                    여기를 클릭하세요
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setIsImageUploaded(true);
                      }
                    }}
                  />
                </div>

                {/* 우하단 + 버튼 */}
                <button
                  className="absolute bottom-4 right-4 w-10 h-10 bg-slate-300 rounded-full border-2 border-slate-400 flex items-center justify-center hover:bg-slate-400 transition-colors"
                  style={{ boxShadow: shadows.small }}
                >
                  <div className="relative w-5 h-5">
                    <Image
                      src="/icons/ic_plus,small.svg"
                      alt="추가"
                      fill
                      className="brightness-0"
                    />
                  </div>
                </button>
              </>
            )}
          </div>
        </div>

        {/* 메모 영역 */}
        <div
          className="bg-white rounded-2xl p-6 border-2 border-slate-900"
          style={{ boxShadow: shadows.small }}
        >
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Memo</h3>
          <textarea
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            className="w-full h-64 md:h-80 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl resize-none focus:outline-none focus:border-yellow-400 transition-colors"
            placeholder="메모를 작성하세요..."
          />
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex justify-end">
        <ActionButtons onEditComplete={handleEditComplete} onDelete={handleDelete} />
      </div>
    </div>
  );
}
