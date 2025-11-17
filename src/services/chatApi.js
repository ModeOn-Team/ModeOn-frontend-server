// 채팅 관련 REST API 서비스
import api from "./api.js";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
const WS_URL = import.meta.env.VITE_WS_URL || "http://localhost:8080";

// 채팅방 생성 및 WebSocket 연결 정보 받기
export const joinChatRoom = async (userId) => {
  const response = await api.post(`/api/chating/join?userId=${userId}`);
  return response.data;
};

// 텍스트 메시지 전송
// 백엔드 인증/인가 강화: sender에 따라 userId 또는 adminId 필수
export const sendTextMessage = async (data) => {
  const messageDto = {
    roomId: data.roomId,
    sender: data.sender || "USER",
    message: data.message || data.content,
    messageType: data.messageType || "TEXT",
    metadata: data.metadata || null,
    userId: data.userId,
    adminId: data.adminId || null,
  };
  
  // roomId는 항상 필수
  if (!messageDto.roomId) {
    throw new Error("roomId는 필수입니다.");
  }
  
  // sender에 따라 userId 또는 adminId 필수
  if (messageDto.sender === "USER" && !messageDto.userId) {
    throw new Error("일반 사용자는 userId가 필수입니다.");
  }
  if (messageDto.sender === "ADMIN" && !messageDto.adminId) {
    throw new Error("관리자는 adminId가 필수입니다.");
  }
  
  const response = await api.post("/api/chating/message/text", messageDto);
  return response.data;
};

// 이미지 메시지 전송
// 백엔드 인증/인가 강화: sender에 따라 userId 또는 adminId 필수
export const sendImageMessage = async (data) => {
  const messageDto = {
    roomId: data.roomId,
    sender: data.sender || "USER",
    message: data.imageUrl || data.message,
    messageType: "IMAGE",
    metadata: data.metadata || null,
    userId: data.userId,
    adminId: data.adminId || null,
  };
  
  if (!messageDto.roomId) {
    throw new Error("roomId는 필수입니다.");
  }
  
  if (messageDto.sender === "USER" && !messageDto.userId) {
    throw new Error("일반 사용자는 userId가 필수입니다.");
  }
  if (messageDto.sender === "ADMIN" && !messageDto.adminId) {
    throw new Error("관리자는 adminId가 필수입니다.");
  }
  
  const response = await api.post("/api/chating/message/image", messageDto);
  return response.data;
};

// 파일 메시지 전송
// 백엔드 인증/인가 강화: sender에 따라 userId 또는 adminId 필수
export const sendFileMessage = async (data) => {
  const messageDto = {
    roomId: data.roomId,
    sender: data.sender || "USER",
    message: data.fileUrl || data.message,
    messageType: "FILE",
    metadata: data.metadata || null,
    userId: data.userId,
    adminId: data.adminId || null,
  };
  
  if (!messageDto.roomId) {
    throw new Error("roomId는 필수입니다.");
  }
  
  if (messageDto.sender === "USER" && !messageDto.userId) {
    throw new Error("일반 사용자는 userId가 필수입니다.");
  }
  if (messageDto.sender === "ADMIN" && !messageDto.adminId) {
    throw new Error("관리자는 adminId가 필수입니다.");
  }
  
  const response = await api.post("/api/chating/message/file", messageDto);
  return response.data;
};

// 관리자용 - 전체 유저 채팅 목록 조회
export const getAdminChatList = async (adminId = null) => {
  const url = adminId 
    ? `/api/chating/admin?adminId=${adminId}`
    : "/api/chating/admin";
  const response = await api.get(url);
  return response.data;
};

// 채팅방의 메시지 목록 조회
export const getChatMessages = async (roomId) => {
  const response = await api.get(`/api/chating/messages?roomId=${roomId}`);
  return response.data;
};

// 채팅방 접근 권한 검증
export const validateChatRoomAccess = async (roomId) => {
  try {
    // 메시지 조회 API를 통해 접근 권한 검증 (403 에러 시 접근 불가)
    await api.get(`/api/chating/messages?roomId=${roomId}`);
    return true;
  } catch (error) {
    if (error.response?.status === 403 || error.response?.status === 404) {
      return false;
    }
    throw error;
  }
};

// STOMP WebSocket 연결 URL
// /ws/chat (SockJS 엔드포인트)
export const getWebSocketUrl = () => {
  return `${WS_URL}/ws/chat`;
};

export default {
  joinChatRoom,
  sendTextMessage,
  sendImageMessage,
  sendFileMessage,
  getAdminChatList,
  getChatMessages,
  getWebSocketUrl,
};
