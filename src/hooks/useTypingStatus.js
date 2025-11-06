import { useEffect, useRef } from "react";
import useChatStore from "../store/chatStore";


const useTypingStatus = (roomId, sendTypingStatus) => {
  const { setIsTyping } = useChatStore();
  const typingTimeoutRef = useRef(null);
  const lastTypingTimeRef = useRef(null);

  // Typing 상태 전송 디바운싱 (300ms)
  const TYPING_DEBOUNCE = 300;
  const TYPING_STOP_DELAY = 2000; // 2초 동안 입력 없으면 typing 해제

  // 입력 시작 처리
  const handleTypingStart = () => {
    if (!roomId || !sendTypingStatus) return;

    const now = Date.now();
    const lastTyping = lastTypingTimeRef.current;

    // 디바운싱: 300ms 이내 중복 요청 방지
    if (lastTyping && now - lastTyping < TYPING_DEBOUNCE) {
      return;
    }

    lastTypingTimeRef.current = now;
    setIsTyping(true);
    sendTypingStatus(true);

    // 기존 타이머 클리어
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // 2초 후 typing 해제
    typingTimeoutRef.current = setTimeout(() => {
      handleTypingStop();
    }, TYPING_STOP_DELAY);
  };

  // 입력 종료 처리
  const handleTypingStop = () => {
    if (!roomId || !sendTypingStatus) return;

    setIsTyping(false);
    sendTypingStatus(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }

    lastTypingTimeRef.current = null;
  };

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      // 언마운트 시 typing 상태 해제
      if (roomId && sendTypingStatus) {
        sendTypingStatus(false);
      }
    };
  }, [roomId, sendTypingStatus]);

  return {
    handleTypingStart,
    handleTypingStop,
  };
};

export default useTypingStatus;

