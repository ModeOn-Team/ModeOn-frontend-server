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
    setTypingStatus,
    socket,
    isConnected,
  } = useChatStore();

  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef(null);
  const subscriptionRef = useRef(null);
  const connectionErrorRef = useRef(null);
  const stompClientRef = useRef(null);
  const isConnectingRef = useRef(false);

  // STOMP 클라이언트 연결
  const connect = useCallback(() => {
    if (!roomId) {
      console.warn("roomId가 없어 WebSocket 연결을 건너뜁니다.");
      return;
    }

    // 중복 연결 방지
    if (stompClientRef.current && stompClientRef.current.connected) {
      console.log("이미 연결된 WebSocket이 있습니다. 중복 연결을 건너뜁니다.");
      return;
    }

    // 연결 중인 경우 방지
    if (isConnectingRef.current) {
      console.log("WebSocket 연결이 이미 진행 중입니다. 중복 연결을 건너뜁니다.");
      return;
    }

    const token = StorageService.getAccessToken();
    if (!token) {
      console.error("인증 토큰이 없습니다. WebSocket 연결을 건너뜁니다.");
      setConnected(false);
      return;
    }

    isConnectingRef.current = true;

    try {
      // SockJS 연결 생성
      const wsUrl = getWebSocketUrl();
      console.log("WebSocket 연결 시도:", wsUrl);
      const socket = new SockJS(wsUrl);
      
      // STOMP 클라이언트 생성
      const stompClient = new Client({
        webSocketFactory: () => socket,
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        reconnectDelay: 0, // 자동 재연결 비활성화 (수동으로 제어)
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        debug: (str) => {
          // 개발 환경에서만 디버그 로그 출력
          if (import.meta.env.DEV) {
            console.log("STOMP DEBUG:", str);
          }
        },
        onConnect: (frame) => {
          console.log("STOMP 연결 성공:", roomId);
          console.log("STOMP CONNECTED 프레임:", frame);
          isConnectingRef.current = false;
          setConnected(true);
          setSocket(stompClient);
          reconnectAttempts.current = 0;
          connectionErrorRef.current = null;
          useChatStore.getState().setError(null);

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
                    setTypingStatus(
                      roomId,
                      data.userId,
                      data.isTyping || true
                    );
                  } else if (data.messageType === "ONLINE_STATUS") {
                    // 온라인 상태 업데이트
                    setOnlineUsers(roomId, data.userIds || []);
                  } else {
                    // 일반 메시지 수신
                    // 백엔드에서 id를 보장하므로 id가 없으면 에러 로그만 출력
                    if (!data.id) {
                      console.warn("메시지에 id가 없습니다:", data);
                    }
                    
                    // 안내 메시지 디버깅
                    if (data.messageType === "SYSTEM" || 
                        (data.message && (
                          data.message.includes("고객님께서 주문하시는 제품은 모두") ||
                          data.message.includes("교환/반품 안내") ||
                          data.message.includes("상품 수령일로부터 7일 이내")
                        ))) {
                      console.log("안내 메시지 수신:", {
                        messageType: data.messageType,
                        sender: data.sender,
                        message: data.message?.substring(0, 100),
                        fullData: data
                      });
                    }
                    
                    // 이미지 메시지인 경우, message가 Base64인지 확인
                    const isImageBase64 = data.messageType === "IMAGE" && 
                      data.message && 
                      typeof data.message === 'string' && 
                      data.message.startsWith('data:image');
                    
                    addMessage(roomId, {
                      id: data.id || `msg-${data.roomId}-${data.createdAt || Date.now()}-${Math.random()}`,
                      roomId: data.roomId,
                      senderId: data.sender === "USER" ? data.userId : data.adminId,
                      receiverId: data.sender === "USER" ? data.adminId : data.userId,
                      // 이미지 메시지이고 message가 Base64인 경우 content는 빈 문자열로 설정
                      content: isImageBase64 ? "" : (data.message || ""),
                      messageType: data.messageType,
                      timestamp: data.createdAt || new Date().toISOString(),
                      isRead: false,
                      sender: data.sender, // "USER" 또는 "ADMIN"
                      userId: data.userId,
                      adminId: data.adminId,
                      metadata: data.metadata,
                      ...(data.messageType === "IMAGE" && { fileUrl: data.message || data.imageUrl }),
                      ...(data.messageType === "FILE" && {
                        fileUrl: data.message || data.fileUrl,
                        fileName: data.metadata ? (typeof data.metadata === 'string' ? JSON.parse(data.metadata)?.fileName : data.metadata?.fileName) : null,
                      }),
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
          const errorMessage = frame.headers?.message || frame.message || "알 수 없는 STOMP 에러";
          console.error("STOMP 에러:", frame);
          console.error("에러 메시지:", errorMessage);
          isConnectingRef.current = false;
          
          // 즉시 연결 해제
          if (stompClientRef.current && stompClientRef.current.connected) {
            try {
              stompClientRef.current.deactivate();
            } catch (e) {
              console.error("연결 해제 중 오류:", e);
            }
          }
          setSocket(null);
          setConnected(false);
          stompClientRef.current = null;
          
          // JWT 인증 실패인 경우
          if (errorMessage.includes("인증에 실패했습니다") || 
              errorMessage.includes("JWT") || 
              errorMessage.includes("서명이 일치하지 않습니다")) {
            console.error("JWT 인증 실패. 토큰이 만료되었거나 유효하지 않습니다. 재연결을 완전히 중단합니다.");
            connectionErrorRef.current = "인증에 실패했습니다. 로그인을 다시 해주세요.";
            reconnectAttempts.current = maxReconnectAttempts; // 재연결 중단
            useChatStore.getState().setError(connectionErrorRef.current);
            
            // 재연결 타이머가 있다면 즉시 취소
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
              reconnectTimeoutRef.current = null;
            }
            return;
          }
          
          // 백엔드 설정 문제로 보이는 에러인 경우 재연결 중단
          if (errorMessage.includes("ExecutorSubscribableChannel") || 
              errorMessage.includes("clientInboundChannel")) {
            console.error("백엔드 WebSocket 설정 문제로 보입니다. 재연결을 중단합니다.");
            connectionErrorRef.current = "백엔드 WebSocket 서버 설정 문제입니다. 백엔드 개발자에게 문의하세요.";
            reconnectAttempts.current = maxReconnectAttempts; // 재연결 중단
            useChatStore.getState().setError(connectionErrorRef.current);
            
            // 재연결 타이머가 있다면 즉시 취소
            if (reconnectTimeoutRef.current) {
              clearTimeout(reconnectTimeoutRef.current);
              reconnectTimeoutRef.current = null;
            }
          }
        },
        onWebSocketError: (event) => {
          console.error("WebSocket 에러:", event);
          console.error("연결 URL:", getWebSocketUrl());
          isConnectingRef.current = false;
          setConnected(false);
        },
        onDisconnect: () => {
          console.log("STOMP 연결 종료");
          isConnectingRef.current = false;
          setConnected(false);
          setSocket(null);
          
          // 에러가 발생한 경우 재연결 중단
          if (connectionErrorRef.current) {
            console.error("재연결 중단:", connectionErrorRef.current);
            return;
          }
          
          // 재연결 시도 (에러가 없는 경우에만)
          if (reconnectAttempts.current < maxReconnectAttempts) {
            // 최소 3초, 최대 30초로 지수 백오프
            const baseDelay = 3000; // 최소 3초
            const delay = Math.min(baseDelay * Math.pow(2, reconnectAttempts.current), 30000);
            reconnectAttempts.current++;

            console.log(
              `재연결 시도 ${reconnectAttempts.current}/${maxReconnectAttempts} (${delay}ms 후)`
            );

            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, delay);
          } else {
            console.error("최대 재연결 시도 횟수에 도달했습니다.");
          }
        },
      });

      // 연결 시작
      stompClientRef.current = stompClient;
      stompClient.activate();
    } catch (error) {
      console.error("STOMP 연결 실패:", error);
      isConnectingRef.current = false;
      setConnected(false);
      stompClientRef.current = null;
    }
  }, [roomId, setSocket, setConnected, addMessage, setOnlineUsers, setTypingStatus]);

  // STOMP 연결 해제
  const disconnect = useCallback(() => {
    // 재연결 타이머 취소
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    // 구독 해제
    if (subscriptionRef.current) {
      try {
        subscriptionRef.current.unsubscribe();
      } catch (e) {
        console.error("구독 해제 중 오류:", e);
      }
      subscriptionRef.current = null;
    }

    // 연결 해제
    if (socket && socket.connected) {
      try {
        socket.deactivate();
      } catch (e) {
        console.error("연결 해제 중 오류:", e);
      }
    }

    if (stompClientRef.current && stompClientRef.current.connected) {
      try {
        stompClientRef.current.deactivate();
      } catch (e) {
        console.error("연결 해제 중 오류:", e);
      }
    }

    setSocket(null);
    setConnected(false);
    stompClientRef.current = null;
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
            // isTyping: isTyping,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId]); // roomId만 의존성으로 사용하여 무한 루프 방지

  return {
    isConnected,
    connect,
    disconnect,
    sendMessage,
    sendTypingStatus,
  };
};

export default useChatSocket;
