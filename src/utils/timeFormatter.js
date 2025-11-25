// 시간 포맷팅 유틸리티
// 채팅 메시지의 timestamp를 사용자 친화적인 형태로 변환

// LocalDateTime 문자열을 HH:mm 형식으로 변환
// 백엔드에서 Asia/Seoul 시간대를 사용하므로 명시적으로 처리
export const formatChatTime = (timestamp) => {
  if (!timestamp) return "";
  
  try {
    let date;
    
    if (typeof timestamp === 'string') {
      // ISO 8601 형식 확인: "2024-01-01T12:00:00" (시간대 정보 없음)
      // 또는 "2024-01-01T12:00:00+09:00" (시간대 정보 있음)
      // 또는 "2024-01-01T12:00:00Z" (UTC)
      
      // 시간대 정보가 있는지 확인 (Z, +, - 뒤에 숫자가 있는지)
      const hasTimezone = timestamp.includes('Z') || 
                         /[+-]\d{2}:\d{2}$/.test(timestamp) ||
                         /[+-]\d{4}$/.test(timestamp);
      
      if (!hasTimezone && timestamp.includes('T')) {
        // 시간대 정보가 없으면 Asia/Seoul(+09:00)로 간주
        // "2024-01-01T12:00:00" -> "2024-01-01T12:00:00+09:00"
        date = new Date(timestamp + '+09:00');
      } else {
        date = new Date(timestamp);
      }
    } else {
      date = new Date(timestamp);
    }
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      console.warn("유효하지 않은 timestamp:", timestamp);
      return "";
    }
    
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("시간 포맷팅 오류:", error, timestamp);
    return "";
  }
};

// 상대적 시간 표시 (오늘, 어제, 날짜)
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return "";
  
  try {
    let date;
    
    if (typeof timestamp === 'string') {
      // ISO 8601 형식 확인: 시간대 정보가 있는지 확인
      const hasTimezone = timestamp.includes('Z') || 
                         /[+-]\d{2}:\d{2}$/.test(timestamp) ||
                         /[+-]\d{4}$/.test(timestamp);
      
      if (!hasTimezone && timestamp.includes('T')) {
        // 시간대 정보가 없으면 Asia/Seoul(+09:00)로 간주
        date = new Date(timestamp + '+09:00');
      } else {
        date = new Date(timestamp);
      }
    } else {
      date = new Date(timestamp);
    }
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      console.warn("유효하지 않은 timestamp:", timestamp);
      return "";
    }
    
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
    console.error("상대적 시간 포맷팅 오류:", error, timestamp);
    return "";
  }
};

