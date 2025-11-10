// 시간 포맷팅 유틸리티
// 채팅 메시지의 timestamp를 사용자 친화적인 형태로 변환

// LocalDateTime 문자열을 HH:mm 형식으로 변환
export const formatChatTime = (timestamp) => {
  if (!timestamp) return "";
  
  try {
    const date = new Date(timestamp);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("시간 포맷팅 오류:", error);
    return "";
  }
};

// 상대적 시간 표시 (오늘, 어제, 날짜)
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays === 1) return "어제";
    if (diffDays < 7) return `${diffDays}일 전`;
    
    // 7일 이상이면 날짜 표시
    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("상대적 시간 포맷팅 오류:", error);
    return "";
  }
};

