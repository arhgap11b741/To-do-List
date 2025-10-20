# Todo List Application

> Next.js 15 App Router와 TypeScript를 활용한 현대적인 Todo 관리 애플리케이션

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [기술적 의사결정](#기술적-의사결정)
- [아키텍처 설계](#아키텍처-설계)
- [주요 구현 사항](#주요-구현-사항)
- [성능 최적화](#성능-최적화)
- [개발 경험 개선](#개발-경험-개선)
- [트레이드오프와 개선 방향](#트레이드오프와-개선-방향)

---

## 프로젝트 개요

이 프로젝트는 단순한 Todo 앱을 넘어, **현대적인 웹 개발 패러다임과 베스트 프랙티스를 적용한 실무 수준의 프론트엔드 애플리케이션**입니다. RESTful API 연동, 상태 관리, 에러 핸들링, 사용자 경험 최적화 등 실제 프로덕션 환경에서 고려해야 할 요소들을 구현했습니다.

### 핵심 기능

- 할 일 생성, 조회, 수정, 삭제 (CRUD)
- 완료/미완료 상태 관리 및 자동 분류
- 상세 페이지를 통한 메모 추가 및 편집
- 반응형 UI (모바일 우선 설계)
- 낙관적 업데이트(Optimistic Update)를 통한 즉각적인 사용자 피드백

---

## 기술적 의사결정

### 1. Next.js 15 (App Router) 선택 이유

**선택한 이유:**

- **Server Components**: 초기 로딩 성능 최적화와 SEO 개선
- **File-based Routing**: 직관적인 라우팅 구조로 유지보수성 향상
- **API Routes**: 백엔드 없이도 서버 사이드 로직 처리 가능
- **자동 코드 스플리팅**: 페이지별 최적화된 번들 생성

**트레이드오프:**

- App Router는 비교적 새로운 패러다임이지만, 장기적으로 React의 방향성과 일치
- 학습 곡선이 있지만, 더 나은 성능과 DX(Developer Experience)를 제공

### 2. TypeScript 도입

```typescript
// src/lib/api.ts - 타입 안정성 확보
export interface TodoItem {
  id: number;
  tenantId: string;
  name: string;
  memo?: string;
  imageUrl?: string;
  isCompleted: boolean;
}
```

**효과:**

- 컴파일 타임에 타입 에러 검출 → 런타임 버그 감소
- IDE 자동완성 지원으로 개발 속도 향상
- API 인터페이스 명확화로 프론트엔드-백엔드 계약 문서화

### 3. Tailwind CSS 4 채택

**선택한 이유:**

- Utility-first 접근으로 빠른 UI 개발
- JIT(Just-In-Time) 컴파일러로 빌드 최적화
- 디자인 시스템 구축의 용이성

```typescript
// src/styles/shadows.ts - 커스텀 디자인 토큰
export const shadows = {
  card: "0 2px 8px rgba(0, 0, 0, 0.08)",
  hover: "0 4px 16px rgba(0, 0, 0, 0.12)",
};
```

**고민한 점:**

- CSS-in-JS vs Utility CSS
  - Runtime overhead 없는 빌드 타임 CSS 생성 선택
  - 번들 크기 최소화 (사용하지 않는 스타일 자동 제거)

### 4. TanStack React Query (v5)

```typescript
// 낙관적 업데이트 구현 예시
const handleToggleTodo = async (id: string, isCompleted: boolean) => {
  // UI 먼저 업데이트 (Optimistic Update)
  setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: isCompleted } : todo)));

  try {
    await updateTodo(id, { isCompleted });
  } catch (error) {
    // 실패 시 롤백
    loadTodos();
  }
};
```

**선택한 이유:**

- 서버 상태 관리 전문 라이브러리
- 자동 캐싱, 리페칭, 백그라운드 동기화
- 낙관적 업데이트로 빠른 사용자 경험 제공

**대안 대비 장점:**

- Redux/Zustand 대비: 서버 상태 관리에 특화
- SWR 대비: 더 풍부한 API와 플러그인 생태계

---

## 아키텍처 설계

### 디렉토리 구조

```
src/
├── app/                    # Next.js App Router
│   ├── items/[id]/        # 동적 라우팅 (상세 페이지)
│   ├── layout.tsx         # 공통 레이아웃 (헤더 포함)
│   └── page.tsx           # 메인 페이지
├── components/            # 재사용 가능한 컴포넌트
│   ├── TodoInput.tsx      # 입력 폼 (제어 컴포넌트)
│   ├── TodoTab.tsx        # Todo 카드 (클릭 → 상세)
│   └── ActionButtons.tsx  # 수정/삭제 버튼
├── lib/                   # 비즈니스 로직
│   └── api.ts            # API 클라이언트 (fetch 래핑)
└── styles/               # 스타일 유틸리티
    └── shadows.ts        # 디자인 토큰
```

### 설계 원칙

#### 1. **관심사의 분리 (Separation of Concerns)**

```typescript
// ❌ 나쁜 예: 컴포넌트에 API 로직 직접 포함
const TodoItem = () => {
  const handleDelete = async () => {
    const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
    // ...
  };
};

// ✅ 좋은 예: API 로직 분리
// src/lib/api.ts
export const deleteTodo = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/${TENANT_ID}/items/${id}`, {
    method: "DELETE",
  });
  // 에러 핸들링 로직 중앙화
  if (!response.ok) throw new Error("삭제 실패");
  return response.json();
};
```

#### 2. **단일 책임 원칙 (Single Responsibility)**

각 컴포넌트는 하나의 명확한 책임을 가집니다:

- `TodoInput`: 입력만 담당
- `TodoTab`: 표시와 체크박스 토글만 담당
- `ActionButtons`: 편집/삭제 액션만 담당

#### 3. **컴포지션 패턴**

```typescript
// 작은 컴포넌트를 조합하여 복잡한 UI 구성
<TodoTab
  id={todo.id}
  text={todo.text}
  completed={todo.completed}
  onToggle={handleToggle}
/>
```

---

## 주요 구현 사항

### 1. 에러 핸들링 전략

```typescript
// src/lib/api.ts - 중앙화된 에러 처리
const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};
```

**구현 의도:**

- API 에러를 일관되게 처리
- 사용자에게 명확한 에러 메시지 제공
- 네트워크 실패 시 적절한 폴백 UI 표시

### 2. 로딩 상태 관리

```typescript
// src/app/page.tsx
const [isLoading, setIsLoading] = useState(true);

if (isLoading) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600" />
      <p>할 일 목록을 불러오는 중...</p>
    </div>
  );
}
```

**UX 고려사항:**

- 스피너 애니메이션으로 진행 상태 시각화
- 최소 높이 설정으로 레이아웃 시프트 방지

### 3. 반응형 디자인

```typescript
// 모바일/데스크톱 분기 이미지 렌더링
<Image
  src="/images/img_todo,small.svg"
  className="mx-auto lg:hidden"  // 모바일만 표시
/>
<Image
  src="/images/img_todo,large.svg"
  className="mx-auto hidden lg:block"  // 데스크톱만 표시
/>
```

**브레이크포인트 전략:**

- 모바일 우선 (Mobile-First)
- Tailwind의 `lg:` prefix 활용 (1024px 기준)

### 4. 상세 페이지 동적 라우팅

```typescript
// src/app/items/[id]/page.tsx
export default function TodoDetailPage({ params }: { params: { id: string } }) {
  // URL 파라미터로 특정 Todo 조회
  const [todo, setTodo] = useState<TodoDetail | null>(null);

  useEffect(() => {
    getTodoById(params.id).then(setTodo);
  }, [params.id]);
}
```

**설계 의도:**

- RESTful URL 구조 (`/items/123`)
- 북마크 가능한 URL
- 뒤로가기/앞으로가기 네이티브 브라우저 지원

---

## 성능 최적화

### 1. 이미지 최적화

```typescript
import Image from 'next/image'

<Image
  src="/images/img_todo,large.svg"
  width={240}
  height={240}
  alt="empty-todo"
/>
```

**효과:**

- Next.js의 자동 이미지 최적화 활용
- WebP 자동 변환 (지원 브라우저에서)
- Lazy loading 기본 적용

### 2. 코드 스플리팅

- 페이지별 자동 번들 분리
- 동적 import를 통한 필요 시점 로딩

```typescript
// Next.js가 자동으로 /items/[id] 페이지를 별도 청크로 분리
```

### 3. 낙관적 업데이트 (Optimistic Update)

```typescript
const handleToggleTodo = async (id: string, isCompleted: boolean) => {
  // 1. 즉시 UI 업데이트 (사용자는 즉각 반응 확인)
  setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: isCompleted } : todo)));

  // 2. 백그라운드에서 API 호출
  try {
    await updateTodo(id, { isCompleted });
  } catch (error) {
    // 3. 실패 시 롤백
    loadTodos();
    alert("상태 변경에 실패했습니다.");
  }
};
```

**UX 향상:**

- 체크박스 클릭 시 지연 없는 즉각 반응
- 네트워크 지연이 사용자 경험에 영향 최소화

---

## 개발 경험 개선

### 1. 코드 품질 도구

```json
// package.json
{
  "scripts": {
    "lint": "eslint",
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,css}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,css}\""
  }
}
```

**구축한 환경:**

- ESLint: 코드 스타일 및 잠재적 버그 검출
- Prettier: 일관된 코드 포맷팅
- TypeScript: 타입 안정성

### 2. 컴포넌트 재사용성

```typescript
// src/components/ActionButtons.tsx
// 수정/삭제 버튼을 하나의 컴포넌트로 추상화
interface ActionButtonsProps {
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onSave: () => void;
  onCancel: () => void;
}
```

**설계 의도:**

- Props 인터페이스로 명확한 API 정의
- 버튼 로직을 재사용 가능한 단위로 분리

---

## 트레이드오프와 개선 방향

### 현재 한계

#### 1. **전역 상태 관리 부재**

```typescript
// 현재: 각 컴포넌트에서 개별적으로 상태 관리
const [todos, setTodos] = useState<TodoItem[]>([]);
```

**문제점:**

- 페이지 이동 시 상태 초기화
- 중복된 API 호출 발생 가능

**개선 방안:**

```typescript
// TanStack React Query로 마이그레이션
const { data: todos, isLoading } = useQuery({
  queryKey: ["todos"],
  queryFn: getTodos,
  staleTime: 5000, // 5초간 캐시 유지
});
```

#### 2. **에러 바운더리 부재**

**현재 한계:**

- 컴포넌트 에러 시 전체 앱 크래시 가능

**개선 방안:**

```typescript
// src/app/error.tsx
'use client'
export default function Error({ error, reset }: {
  error: Error
  reset: () => void
}) {
  return (
    <div>
      <h2>오류가 발생했습니다</h2>
      <button onClick={() => reset()}>다시 시도</button>
    </div>
  )
}
```

#### 3. **접근성 (a11y) 개선 필요**

```typescript
// 추가 필요 사항:
// - ARIA 레이블
// - 키보드 네비게이션
// - 스크린 리더 지원
<button
  aria-label="할 일 삭제"
  onClick={handleDelete}
>
  <Image src="/icons/ic_x.svg" alt="" />
</button>
```

### 향후 개선 계획

1. **서버 컴포넌트 활용 확대**
   - 초기 렌더링 성능 개선
   - SEO 최적화 강화

2. **테스트 코드 작성**
   - Jest + React Testing Library
   - E2E 테스트 (Playwright)

3. **성능 모니터링**
   - Core Web Vitals 측정
   - Lighthouse CI 통합

4. **Progressive Enhancement**
   - JavaScript 비활성화 시에도 기본 기능 동작
   - 오프라인 지원 (Service Worker)

---

## 기술 스택

| 분야       | 기술              | 버전   | 선택 이유                    |
| ---------- | ----------------- | ------ | ---------------------------- |
| 프레임워크 | Next.js           | 15.5.5 | App Router, RSC, 자동 최적화 |
| 언어       | TypeScript        | 5.x    | 타입 안정성, IDE 지원        |
| 스타일링   | Tailwind CSS      | 4.x    | Utility-first, JIT 컴파일    |
| 상태 관리  | TanStack Query    | 5.90.5 | 서버 상태 관리, 캐싱         |
| 코드 품질  | ESLint + Prettier | 최신   | 일관된 코드 스타일           |

---

## 시작하기

### 사전 요구사항

- Node.js 20.x 이상
- npm, yarn, pnpm 또는 bun

### 설치

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

### 환경 변수

```env
# .env.local (필요시)
NEXT_PUBLIC_API_URL=https://assignment-todolist-api.vercel.app/api
NEXT_PUBLIC_TENANT_ID=your-tenant-id
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm run start
```

---

## 프로젝트 구조 상세

```
todo-list/
├── src/
│   ├── app/
│   │   ├── items/[id]/
│   │   │   └── page.tsx           # 상세 페이지 (동적 라우팅)
│   │   ├── layout.tsx             # 공통 레이아웃 (헤더)
│   │   ├── page.tsx               # 메인 페이지 (Todo 목록)
│   │   └── globals.css            # 글로벌 스타일
│   ├── components/
│   │   ├── AddButton.tsx          # 추가 버튼 (절대 위치)
│   │   ├── TodoInput.tsx          # 입력 폼 (제어 컴포넌트)
│   │   ├── TodoTab.tsx            # Todo 카드 (체크박스 + 텍스트)
│   │   ├── TodoIcon.tsx           # TODO 섹션 헤더
│   │   ├── DoneIcon.tsx           # DONE 섹션 헤더
│   │   ├── ActionButtons.tsx      # 수정/삭제 버튼 그룹
│   │   └── Header.tsx             # 앱 헤더 (로고)
│   ├── lib/
│   │   └── api.ts                 # API 클라이언트
│   │       ├── getTodos()         # GET /items
│   │       ├── getTodoById()      # GET /items/:id
│   │       ├── createTodo()       # POST /items
│   │       ├── updateTodo()       # PATCH /items/:id
│   │       └── deleteTodo()       # DELETE /items/:id
│   └── styles/
│       └── shadows.ts             # 커스텀 그림자 토큰
├── public/
│   ├── icons/                     # SVG 아이콘
│   │   ├── ic_check.svg          # 체크 아이콘
│   │   ├── ic_edit.svg           # 수정 아이콘
│   │   ├── ic_x.svg              # 삭제 아이콘
│   │   └── ...
│   └── images/                    # 일러스트레이션
│       ├── img_todo,large.svg    # 빈 상태 이미지 (데스크톱)
│       ├── img_todo,small.svg    # 빈 상태 이미지 (모바일)
│       └── ...
├── eslint.config.mjs             # ESLint 설정
├── tsconfig.json                 # TypeScript 설정
├── next.config.ts                # Next.js 설정
└── package.json                  # 프로젝트 메타데이터
```

---

## 학습 및 회고

### 배운 점

1. **Next.js App Router의 파워**
   - Server Component와 Client Component의 경계 이해
   - 파일 기반 라우팅의 직관성과 생산성

2. **낙관적 업데이트의 중요성**
   - 즉각적인 사용자 피드백이 UX에 미치는 영향
   - 실패 시 롤백 전략의 필요성

3. **타입 시스템의 가치**
   - 리팩토링 시 타입 에러를 통한 사이드 이펙트 조기 발견
   - API 인터페이스 변경 시 컴파일 타임 검증

### 아쉬운 점

- 테스트 코드 부재 → 리팩토링 시 불안감
- 전역 상태 관리 미흡 → 페이지 전환 시 데이터 재로딩
- 접근성 고려 부족 → 키보드/스크린 리더 사용자 경험 개선 필요

---

## 라이센스

MIT License

---

## 연락처

프로젝트에 대한 피드백이나 질문은 이슈로 남겨주세요.
12305025k@gmail.com
