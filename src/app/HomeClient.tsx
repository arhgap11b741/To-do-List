"use client";

import DoneIcon from "@/components/DoneIcon";
import TodoIcon from "@/components/TodoIcon";
import TodoInput from "@/components/TodoInput";
import TodoTab from "@/components/TodoTab";
import { useState } from "react";
import Image from "next/image";
import { createTodo, updateTodo } from "@/lib/api";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

interface HomeClientProps {
  initialTodos: TodoItem[];
}

export default function HomeClient({ initialTodos }: HomeClientProps) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);

  // TO DO 섹션 페이지네이션
  const [todoCurrentPage, setTodoCurrentPage] = useState(1);
  const [todoPageSize] = useState(10);

  // DONE 섹션 페이지네이션
  const [doneCurrentPage, setDoneCurrentPage] = useState(1);
  const [donePageSize] = useState(10);

  const handleAddTodo = async (text: string) => {
    try {
      const newTodo = await createTodo({ name: text });
      // 새로운 할일을 배열의 맨 앞에 추가하여 첫 페이지 상단에 표시
      setTodos([
        {
          id: newTodo.id.toString(),
          text: newTodo.name,
          completed: newTodo.isCompleted,
        },
        ...todos,
      ]);

      // 새로운 할일이 추가되면 첫 페이지로 이동
      setTodoCurrentPage(1);
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

  // TO DO와 DONE을 분리
  const allIncompleteTodos = todos.filter((todo) => !todo.completed);
  const allCompletedTodos = todos.filter((todo) => todo.completed);

  // 페이지네이션된 데이터
  const startTodoIndex = (todoCurrentPage - 1) * todoPageSize;
  const endTodoIndex = startTodoIndex + todoPageSize;
  const incompleteTodos = allIncompleteTodos.slice(startTodoIndex, endTodoIndex);

  const startDoneIndex = (doneCurrentPage - 1) * donePageSize;
  const endDoneIndex = startDoneIndex + donePageSize;
  const completedTodos = allCompletedTodos.slice(startDoneIndex, endDoneIndex);

  // 페이지네이션 정보
  const totalTodoPages = Math.ceil(allIncompleteTodos.length / todoPageSize);
  const totalDonePages = Math.ceil(allCompletedTodos.length / donePageSize);

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

          {/* TO DO 섹션 페이지네이션 */}
          {allIncompleteTodos.length > todoPageSize && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setTodoCurrentPage(todoCurrentPage - 1)}
                disabled={todoCurrentPage === 1}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  todoCurrentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                }`}
              >
                이전
              </button>

              <span className="text-slate-600 text-sm">
                {todoCurrentPage} / {totalTodoPages}
              </span>

              <button
                onClick={() => setTodoCurrentPage(todoCurrentPage + 1)}
                disabled={todoCurrentPage === totalTodoPages}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  todoCurrentPage === totalTodoPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                }`}
              >
                다음
              </button>
            </div>
          )}
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

          {/* DONE 섹션 페이지네이션 */}
          {allCompletedTodos.length > donePageSize && (
            <div className="flex justify-center items-center gap-2 mt-4">
              <button
                onClick={() => setDoneCurrentPage(doneCurrentPage - 1)}
                disabled={doneCurrentPage === 1}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  doneCurrentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                }`}
              >
                이전
              </button>

              <span className="text-slate-600 text-sm">
                {doneCurrentPage} / {totalDonePages}
              </span>

              <button
                onClick={() => setDoneCurrentPage(doneCurrentPage + 1)}
                disabled={doneCurrentPage === totalDonePages}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  doneCurrentPage === totalDonePages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-violet-100 text-violet-700 hover:bg-violet-200"
                }`}
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
