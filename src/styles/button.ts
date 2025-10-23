// 공통 버튼 스타일 상수들
export const BUTTON_BASE_CLASSES = `
  flex items-center gap-2 px-6 py-3 rounded-2xl
  font-semibold transition-colors duration-200
  focus:outline-none focus:ring-2
`;

// 완료/성공 버튼 스타일
export const COMPLETE_BUTTON_CLASSES = `
  ${BUTTON_BASE_CLASSES}
  bg-lime-400 hover:bg-lime-500
  text-slate-900
  focus:ring-lime-600
`;

// 삭제/위험 버튼 스타일
export const DELETE_BUTTON_CLASSES = `
  ${BUTTON_BASE_CLASSES}
  bg-red-500 hover:bg-red-600
  text-white
  focus:ring-red-600
`;

// 추가 버튼 스타일들 (필요시 확장)
export const PRIMARY_BUTTON_CLASSES = `
  ${BUTTON_BASE_CLASSES}
  bg-blue-500 hover:bg-blue-600
  text-white
  focus:ring-blue-600
`;

export const SECONDARY_BUTTON_CLASSES = `
  ${BUTTON_BASE_CLASSES}
  bg-gray-200 hover:bg-gray-300
  text-gray-800
  focus:ring-gray-400
`;
