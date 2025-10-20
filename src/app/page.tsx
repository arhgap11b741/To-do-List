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

  // 초기 데이터 로드
  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    try {
      setIsLoading(true);
      const apiTodos = await getTodos();
      const mappedTodos = apiTodos.map((todo) => ({
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

  const incompleteTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

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
    </div>
  );
}
