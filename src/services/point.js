// src/services/point.js
export const getUserPoints = async () => {
  try {
    const response = await fetch("/api/points", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`포인트 로드 실패: ${response.status}`);
    }

    const data = await response.json();
    return data; // { total: 1250, history: [...] }
  } catch (error) {
    console.error("[Point API] 로드 실패:", error);
    // 에러 시 안전한 기본값 반환
    return {
      total: 0,
      history: [],
    };
  }
};
