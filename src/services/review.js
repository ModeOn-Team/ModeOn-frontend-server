export const getUserReviews = async () => {
  try {
    const response = await fetch("/api/reviews", {
      method: "GET",
      credentials: "include",
    });
    if (!response.ok) throw new Error("리뷰 로드 실패");
    return await response.json();
  } catch (error) {
    console.error("[Review API] 실패:", error);
    return [];
  }
};
