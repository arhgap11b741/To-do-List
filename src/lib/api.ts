const BASE_URL = "https://assignment-todolist-api.vercel.app/api";
const TENANT_ID = "iseo0502";

export interface TodoItem {
  id: number;
  tenantId: string;
  name: string;
  memo?: string;
  imageUrl?: string;
  isCompleted: boolean;
}

export interface CreateTodoRequest {
  name: string;
}

export interface UpdateTodoRequest {
  name?: string;
  memo?: string;
  imageUrl?: string;
  isCompleted?: boolean;
}

// 할 일 목록 조회
export async function getTodos(page: number, pageSize: number): Promise<TodoItem[]> {
  const response = await fetch(`${BASE_URL}/${TENANT_ID}/items?page=${page}&pageSize=${pageSize}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("할 일 목록을 불러오는데 실패했습니다.");
  }

  return response.json();
}

// 할 일 추가
export async function createTodo(data: CreateTodoRequest): Promise<TodoItem> {
  const response = await fetch(`${BASE_URL}/${TENANT_ID}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("할 일을 추가하는데 실패했습니다.");
  }

  return response.json();
}

// 할 일 상세 조회
export async function getTodoById(itemId: string): Promise<TodoItem> {
  const response = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("할 일 정보를 불러오는데 실패했습니다.");
  }

  return response.json();
}

// 할 일 수정
export async function updateTodo(itemId: string, data: UpdateTodoRequest): Promise<TodoItem> {
  const response = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("할 일을 수정하는데 실패했습니다.");
  }

  return response.json();
}

// 할 일 삭제
export async function deleteTodo(itemId: string): Promise<void> {
  const response = await fetch(`${BASE_URL}/${TENANT_ID}/items/${itemId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("할 일을 삭제하는데 실패했습니다.");
  }
}

// 이미지 업로드
export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${BASE_URL}/${TENANT_ID}/images/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("이미지 업로드에 실패했습니다.");
  }

  return response.json();
}
