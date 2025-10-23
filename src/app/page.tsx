import { getTodos, TodoItem as ApiTodoItem } from "@/lib/api";
import HomeClient from "./HomeClient";
import SkeletonLoader from "@/components/SkeletonLoader";
import { Suspense } from "react";

interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

// 서버에서 초기 데이터를 가져오는 함수
async function getInitialTodos(): Promise<TodoItem[]> {
  try {
    const allTodos: ApiTodoItem[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    // 최대 3페이지만 미리 로드 (성능 최적화)
    while (hasMorePages && currentPage <= 3) {
      const pageData = await getTodos(currentPage, 20);

      if (pageData.length === 0 || pageData.length < 20) {
        hasMorePages = false;
      }

      allTodos.push(...pageData);
      currentPage++;
    }

    return allTodos.map((todo) => ({
      id: todo.id.toString(),
      text: todo.name,
      completed: todo.isCompleted,
    }));
  } catch (error) {
    console.error("초기 할 일 목록 로드 실패:", error);
    return [];
  }
}

export default async function Home() {
  return (
    <Suspense fallback={<SkeletonLoader />}>
      <HomePageContent />
    </Suspense>
  );
}

async function HomePageContent() {
  const initialTodos = await getInitialTodos();
  return <HomeClient initialTodos={initialTodos} />;
}
