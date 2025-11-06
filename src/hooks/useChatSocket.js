import { useEffect, useRef, useCallback } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import useChatStore from "../store/chatStore";
import { getWebSocketUrl } from "../services/chatApi";
import StorageService from "../services/storage";

// STOMP + Redis Pub/Sub 기반 실시간 채팅 커스텀 훅
// 백엔드 구조:
// - 엔드포인트: /ws/chat (SockJS)
// - 발행 경로: /pub/chat.sendMessage
// - 구독 경로: /sub/chatroom/{roomId}
// - 인증: Authorization: Bearer {token} 헤더
const useChatSocket = (roomId) => {
  const {
    setSocket,
    setConnected,
    addMessage,
    setOnlineUsers,
    socket,
    isConnected,
  } = useChatStore();

  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef(null);
  const subscriptionRef = useRef(null);

  // STOMP 클라이언트 연결
  const connect = useCallback(() => {
    if (!roomId) {
      console.warn("roomId가 없어 WebSocket 연결을 건너뜁니다.");
      return;
    }

    const token = StorageService.getAccessToken();
    if (!token) {
      console.error("인증 토큰이 없습니다. WebSocket 연결을 건너뜁니다.");
      setConnected(false);
      return;
    }

    try {
      // SockJS 연결 생성
      const socket = new SockJS(getWebSocketUrl());
      
      // STOMP 클라이언트 생성
      const stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => {
          // 개발 환경에서만 디버그 로그 출력
          if (import.meta.env.DEV) {
            console.log("STOMP:", str);
          }
        },
        onConnect: (frame) => {
          console.log("STOMP 연결 성공:", roomId);
          setConnected(true);
          setSocket(stompClient);
          reconnectAttempts.current = 0;

          // 채팅방 구독
          if (roomId) {
            const subscription = stompClient.subscribe(
              `/sub/chatroom/${roomId}`,
              (message) => {
                try {
                  const data = JSON.parse(message.body);
                  
                  // 백엔드 ChatMessageDto 형식으로 메시지 수신
                  // { roomId, sender, message, messageType, metadata, createdAt, userId, adminId }
                  
                  // 메시지 타입에 따라 처리
                  if (data.messageType === "TYPING") {
                    // Typing 상태 업데이트
                    useChatStore.getState().setTypingStatus(
                      roomId,
                      data.userId,
                      data.isTyping || true
                    );
                  } else if (data.messageType === "ONLINE_STATUS") {
                    // 온라인 상태 업데이트
                    setOnlineUsers(roomId, data.userIds || []);
                  } else {
                    // 일반 메시지 수신
                    addMessage(roomId, {
                      id: data.id || Date.now(),
                      roomId: data.roomId,
                      senderId: data.sender === "USER" ? data.userId : data.adminId,
                      receiverId: data.sender === "USER" ? data.adminId : data.userId,
                      content: data.message,
                      messageType: data.messageType,
                      timestamp: data.createdAt || new Date().toISOString(),
                      isRead: false,
                      sender: data.sender, // "USER" 또는 "ADMIN"
                      userId: data.userId,
                      adminId: data.adminId,
                      metadata: data.metadata,
                    });
                  }
                } catch (error) {
                  console.error("메시지 파싱 오류:", error);
                }
              }
            );
            
            subscriptionRef.current = subscription;
            console.log("채팅방 구독 완료:", `/sub/chatroom/${roomId}`);
          }
        },
        onStompError: (frame) => {
          console.error("STOMP 에러:", frame);
          setConnected(false);
        },
        onWebSocketError: (event) => {
          console.error("WebSocket 에러:", event);
          setConnected(false);
        },
        onDisconnect: () => {
          console.log("STOMP 연결 종료");
          setConnected(false);
          setSocket(null);
          
          // 재연결 시도
          if (reconnectAttempts.current < maxReconnectAttempts) {
            const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
            reconnectAttempts.current++;

            console.log(
              `재연결 시도 ${reconnectAttempts.current}/${maxReconnectAttempts} (${delay}ms 후)`
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, delay);
          }
        },
      });

      // 연결 시작
      stompClient.activate();
    } catch (error) {
      console.error("STOMP 연결 실패:", error);
      setConnected(false);
    }
  }, [roomId, setSocket, setConnected, addMessage, setOnlineUsers]);

  // STOMP 연결 해제
  const disconnect = useCallback(() => {
    if (socket && socket.connected) {
      // 구독 해제
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }

      // 연결 해제
      socket.deactivate();
      setSocket(null);
      setConnected(false);
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    reconnectAttempts.current = 0;
  }, [socket, setSocket, setConnected]);

  // 메시지 전송 (STOMP publish)
  // 백엔드: @MessageMapping("/chat.sendMessage") → /pub/chat.sendMessage
  const sendMessage = useCallback(
    (messageData) => {
      if (socket && socket.connected) {
        socket.publish({
          destination: "/pub/chat.sendMessage",
          body: JSON.stringify(messageData),
        });
      } else {
        console.error("STOMP이 연결되지 않았습니다.");
      }
    },
    [socket]
  );

  // Typing 상태 전송 (Redis Pub/Sub)
  const sendTypingStatus = useCallback(
    (isTyping) => {
      if (socket && socket.connected) {
        const currentUserId = StorageService.getUser()?.id;
        if (!currentUserId) return;

        socket.publish({
          destination: "/pub/chat.sendMessage",
          body: JSON.stringify({
            roomId: roomId,
            sender: "USER",
            message: "",
            messageType: "TYPING",
            userId: currentUserId,
            isTyping: isTyping,
          }),
        });
      }
    },
    [socket, roomId]
  );

  // 컴포넌트 마운트 시 연결
  useEffect(() => {
    if (roomId) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [roomId, connect, disconnect]);

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    sendTypingStatus,
  };
};

export default useChatSocket;
