"use client";

import DoneIcon from "@/components/DoneIcon";
import TodoIcon from "@/components/TodoIcon";
import TodoInput from "@/components/TodoInput";
import TodoTab from "@/components/TodoTab";
import { useState, useEffect } from "react";
import Image from "next/image";
import { getTodos, createTodo, updateTodo, TodoItem as ApiTodoItem } from "@/lib/api";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export default function Home() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 균등 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const [sectionPageSize] = useState(10); // 각 섹션당 10개씩

  // 초기 데이터 로드
  useEffect(() => {
    loadAllTodos();
  }, []);

  const loadAllTodos = async () => {
    try {
      setIsLoading(true);

      // 모든 페이지의 데이터를 순차적으로 가져오기
      const allTodos: ApiTodoItem[] = [];
      let currentPage = 1;
      let hasMorePages = true;

      while (hasMorePages) {
        const pageData = await getTodos(currentPage, 20);

        if (pageData.length === 0 || pageData.length < 20) {
          hasMorePages = false;
        }

        allTodos.push(...pageData);
        currentPage++;

        // 무한 루프 방지
        if (currentPage > 100) {
          console.warn("최대 페이지 수에 도달했습니다.");
          break;
        }
      }

      console.log(`총 ${allTodos.length}개의 할일을 ${currentPage - 1}페이지에서 가져왔습니다.`);

      const mappedTodos = allTodos.map((todo) => ({
        id: todo.id.toString(),
        text: todo.name,
        completed: todo.isCompleted,
      }));

      setTodos(mappedTodos);
    } catch (error) {
      console.error("할 일 목록 로드 실패:", error);
      alert("할 일 목록을 불러오는데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTodo = async (text: string) => {
    try {
      const newTodo = await createTodo({ name: text });
      setTodos([
        ...todos,
        {
          id: newTodo.id.toString(),
          text: newTodo.name,
          completed: newTodo.isCompleted,
        },
      ]);
    } catch (error) {
      console.error("할 일 추가 실패:", error);
      alert("할 일을 추가하는데 실패했습니다.");
    }
  };

  const handleToggleTodo = async (id: string, isCompleted: boolean) => {
    try {
      await updateTodo(id, { isCompleted });
      setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: isCompleted } : todo)));
    } catch (error) {
      console.error("할 일 상태 변경 실패:", error);
      alert("할 일 상태를 변경하는데 실패했습니다.");
    }
  };

  // TO DO와 DONE을 분리하고 정렬
  const allIncompleteTodos = todos
    .filter((todo) => !todo.completed)
    .sort((a, b) => parseInt(b.id) - parseInt(a.id));
  const allCompletedTodos = todos
    .filter((todo) => todo.completed)
    .sort((a, b) => parseInt(b.id) - parseInt(a.id));

  // 현재 페이지의 TO DO (각 페이지당 10개)
  const todoStartIndex = (currentPage - 1) * sectionPageSize;
  const todoEndIndex = todoStartIndex + sectionPageSize;
  const incompleteTodos = allIncompleteTodos.slice(todoStartIndex, todoEndIndex);

  // 현재 페이지의 DONE (각 페이지당 10개)
  const doneStartIndex = (currentPage - 1) * sectionPageSize;
  const doneEndIndex = doneStartIndex + sectionPageSize;
  const completedTodos = allCompletedTodos.slice(doneStartIndex, doneEndIndex);

  // 총 페이지 수 (TO DO와 DONE 중 더 많은 쪽 기준)
  const totalTodoPages = Math.ceil(allIncompleteTodos.length / sectionPageSize);
  const totalDonePages = Math.ceil(allCompletedTodos.length / sectionPageSize);
  const totalPages = Math.max(totalTodoPages, totalDonePages);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-slate-600">할 일 목록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6 md:py-12">
      {/* 할 일 입력 */}
      <TodoInput onAdd={handleAddTodo} />

      {/* TO DO와 DONE 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* TO DO 섹션 */}
        <div className="space-y-4">
          <TodoIcon />
          <div className="space-y-3">
            {incompleteTodos.length === 0 ? (
              <div className="text-center py-8">
                {/* 모바일 */}
                <Image
                  src="/images/img_todo,small.svg"
                  alt="empty-todo"
                  width={120}
                  height={120}
                  className="mx-auto lg:hidden"
                />
                {/* 데스크탑 */}
                <Image
                  src="/images/img_todo,large.svg"
                  alt="empty-todo"
                  width={240}
                  height={240}
                  className="mx-auto hidden lg:block"
                />

                <p className="text-slate-400">
                  완료할 일이 없어요.
                  <br />
                  TO DO를 새롭게 추가해 주세요!
                </p>
              </div>
            ) : (
              incompleteTodos.map((todo) => (
                <TodoTab
                  key={todo.id}
                  id={todo.id}
                  text={todo.text}
                  completed={todo.completed}
                  onToggle={(isCompleted) => handleToggleTodo(todo.id, isCompleted)}
                />
              ))
            )}
          </div>
        </div>

        {/* DONE 섹션 */}
        <div className="space-y-4">
          <DoneIcon />
          <div className="space-y-3">
            {completedTodos.length === 0 ? (
              <div className="text-center py-8">
                <Image
                  src="/images/img_done,large.svg"
                  alt="empty-done"
                  width={240}
                  height={240}
                  className="mx-auto hidden lg:block"
                />
                <Image
                  src="/images/img_done,small.svg"
                  alt="empty-done"
                  width={120}
                  height={120}
                  className="mx-auto lg:hidden"
                />
                <p className="text-slate-400">
                  아직 다 한 일이 없어요.
                  <br />
                  해야 할 일을 체크해 보세요!
                </p>
              </div>
            ) : (
              completedTodos.map((todo) => (
                <TodoTab
                  key={todo.id}
                  id={todo.id}
                  text={todo.text}
                  completed={todo.completed}
                  onToggle={(isCompleted) => handleToggleTodo(todo.id, isCompleted)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* 균등 페이지네이션 */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-violet-100 text-violet-700 hover:bg-violet-200"
            }`}
          >
            이전
          </button>

          <span className="text-slate-600 font-medium">
            페이지 {currentPage} / {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-violet-100 text-violet-700 hover:bg-violet-200"
            }`}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
}
