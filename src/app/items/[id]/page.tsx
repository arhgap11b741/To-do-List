"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, use, useCallback } from "react";
import Image from "next/image";
import { shadows } from "@/styles/shadows";
import ActionButtons from "@/components/ActionButtons";
import TodoTab from "@/components/TodoTab";
import {
  getTodoById,
  updateTodo,
  deleteTodo,
  uploadImage,
  TodoItem as ApiTodoItem,
} from "@/lib/api";

export default function TodoDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const [currentTodo, setCurrentTodo] = useState<ApiTodoItem | null>(null);
  const [memo, setMemo] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const loadTodoDetail = useCallback(async () => {
    try {
      setIsLoading(true);
      const todo = await getTodoById(resolvedParams.id);
      setCurrentTodo(todo);
      setMemo(todo.memo || "");
      setImageUrl(todo.imageUrl || "");
    } catch (error) {
      console.error("할 일 상세 정보 로드 실패:", error);
      alert("할 일 정보를 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, [resolvedParams.id]);

  // 초기 데이터 로드
  useEffect(() => {
    loadTodoDetail();
  }, [loadTodoDetail]);

  const handleEditComplete = async () => {
    if (!currentTodo) return;

    try {
      await updateTodo(resolvedParams.id, {
        memo,
        imageUrl: imageUrl || undefined,
      });
      alert("수정이 완료되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("수정 실패:", error);
      alert("수정하는데 실패했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!currentTodo) return;

    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteTodo(resolvedParams.id);
      alert("삭제되었습니다.");
      router.push("/");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제하는데 실패했습니다.");
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const result = await uploadImage(file);
      setImageUrl(result.url);
    } catch (error) {
      console.error("이미지 업로드 실패:", error);
      alert("이미지 업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleToggleComplete = async () => {
    if (!currentTodo) return;

    try {
      const updatedTodo = await updateTodo(resolvedParams.id, {
        isCompleted: !currentTodo.isCompleted,
      });
      setCurrentTodo(updatedTodo);
    } catch (error) {
      console.error("완료 상태 변경 실패:", error);
      alert("완료 상태 변경에 실패했습니다.");
    }
  };

  // 로딩 중
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-slate-600">할 일 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

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

  return (
    <div className="bg-white rounded-xl p-6 md:p-12">
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

      {/* TodoTab 헤더 */}
      <TodoTab
        id={resolvedParams.id}
        text={currentTodo.name}
        completed={currentTodo.isCompleted}
        onToggle={handleToggleComplete}
        variant="detail"
        clickable={false}
        className="mb-8"
      />

      {/* 메인 콘텐츠 영역 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 이미지 영역 */}
        <div
          className="bg-white rounded-2xl p-6 border-2 border-slate-900 relative"
          style={{ boxShadow: shadows.small }}
        >
          <div className="aspect-square bg-yellow-100 rounded-xl border-2 border-dashed border-yellow-300 relative overflow-hidden">
            {imageUrl && imageUrl.startsWith("http") ? (
              <>
                {/* 업로드된 이미지 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <Image
                    src={imageUrl}
                    alt="할 일 이미지"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>

                {/* 편집 버튼 */}
                <label
                  className="absolute bottom-4 right-4 w-10 h-10 bg-slate-700 rounded-full border-2 border-slate-900 flex items-center justify-center hover:bg-slate-600 transition-colors cursor-pointer"
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
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                    disabled={isUploading}
                  />
                </label>
              </>
            ) : (
              <>
                <label className="flex flex-col items-center justify-center h-full p-8 cursor-pointer">
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mb-4"></div>
                      <p className="text-slate-500 text-center">이미지 업로드 중...</p>
                    </>
                  ) : (
                    <>
                      <div className="relative w-16 h-16 mb-4">
                        <Image
                          src="/icons/ic_plus,large.svg"
                          alt="이미지 추가"
                          fill
                          className="brightness-0 opacity-50"
                        />
                      </div>
                      <p className="text-slate-500 text-center text-sm">
                        이미지를 추가하려면
                        <br />
                        여기를 클릭하세요
                      </p>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                    disabled={isUploading}
                  />
                </label>

                {/* 우하단 + 버튼 */}
                <label
                  className="absolute bottom-4 right-4 w-10 h-10 bg-slate-300 rounded-full border-2 border-slate-400 flex items-center justify-center hover:bg-slate-400 transition-colors cursor-pointer"
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
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                    disabled={isUploading}
                  />
                </label>
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
