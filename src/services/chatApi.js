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
  if (!messageDto.roomId || !messageDto.userId) {
    throw new Error("roomId와 userId는 필수입니다.");
  }
  
  const response = await api.post("/api/chating/message/text", messageDto);
  return response.data;
};

// 이미지 메시지 전송
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
  
  const response = await api.post("/api/chating/message/image", messageDto);
  return response.data;
};

// 파일 메시지 전송
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
