import { create } from "zustand";
import StorageService from "../services/storage";

// 채팅 관련 전역 상태 관리 (Zustand)
const useChatStore = create((set, get) => ({
  chatRooms: [],
  currentRoomId: null,
  messages: {},
  isConnected: false,
  socket: null,
  typingUsers: {}, // { roomId: { userId: true } }
  onlineUsers: {}, // { roomId: [userId1, userId2] }
  isTyping: false,
  loading: false,
  error: null,
  
  setChatRooms: (rooms) => set({ chatRooms: rooms }),
  
  setCurrentRoomId: (roomId) => {
    set({ currentRoomId: roomId });
    if (roomId) {
      get().markMessagesAsRead(roomId);
    }
  },
  
  addMessage: (roomId, message) => {
    const messages = get().messages;
    const roomMessages = messages[roomId] || [];
    
    // 중복 메시지 체크 (같은 id가 있으면 추가하지 않음)
    if (roomMessages.some((m) => m.id === message.id)) {
      return;
    }
    
    // 백엔드에서 받은 메시지인 경우, 같은 내용의 임시 메시지(temp-user-, temp-image-로 시작하는 ID) 제거
    // 임시 메시지는 프론트엔드에서 즉시 표시하기 위해 추가한 것이므로, 백엔드에서 받은 메시지로 대체
    const filteredMessages = roomMessages.filter((m) => {
      // id가 없으면 유지
      if (!m.id || typeof m.id !== 'string') {
        return true;
      }
      
      // 임시 메시지가 아니면 유지
      if (!m.id.startsWith("temp-user-") && !m.id.startsWith("temp-image-")) {
        return true;
      }
      
      // 텍스트 메시지인 경우: 내용이 같고 같은 sender이면 제거
      if (m.messageType === "TEXT" || !m.messageType) {
        if (
          m.content === message.content &&
          m.sender === message.sender &&
          m.senderId === message.senderId
        ) {
          return false; // 제거
        }
      }
      
      // 이미지 메시지인 경우: fileUrl이 같고 같은 sender이면 제거
      if (m.messageType === "IMAGE" && message.messageType === "IMAGE") {
        if (
          m.fileUrl === message.fileUrl &&
          m.sender === message.sender &&
          m.senderId === message.senderId
        ) {
          return false; // 제거
        }
      }
      
      return true; // 유지
    });
    
    const finalMessages = [...filteredMessages, message].sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
    );
    
    // 안내 메시지 디버깅
    if (message.messageType === "SYSTEM" || 
        (message.content && (
          message.content.includes("고객님께서 주문하시는 제품은 모두") ||
          message.content.includes("교환/반품 안내") ||
          message.content.includes("상품 수령일로부터 7일 이내")
        ))) {
      console.log("안내 메시지 store에 추가:", {
        id: message.id,
        messageType: message.messageType,
        sender: message.sender,
        content: message.content?.substring(0, 100),
        roomId,
        totalMessages: finalMessages.length
      });
    }
    
    set({
      messages: {
        ...messages,
        [roomId]: finalMessages,
      },
    });
  },
  
  setMessages: (roomId, messageList) => {
    const messages = get().messages;
    set({
      messages: {
        ...messages,
        [roomId]: messageList.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        ),
      },
    });
  },
  
  setSocket: (socket) => set({ socket }),
  setConnected: (isConnected) => set({ isConnected }),
  
  setTypingStatus: (roomId, userId, isTyping) => {
    const typingUsers = get().typingUsers;
    const roomTyping = typingUsers[roomId] || {};
    
    if (isTyping) {
      set({
        typingUsers: {
          ...typingUsers,
          [roomId]: { ...roomTyping, [userId]: true },
        },
      });
    } else {
      const newRoomTyping = { ...roomTyping };
      delete newRoomTyping[userId];
      set({
        typingUsers: {
          ...typingUsers,
          [roomId]: newRoomTyping,
        },
      });
    }
  },
  
  setOnlineUsers: (roomId, userIds) => {
    const onlineUsers = get().onlineUsers;
    set({
      onlineUsers: {
        ...onlineUsers,
        [roomId]: userIds,
      },
    });
  },
  
  setIsTyping: (isTyping) => set({ isTyping }),
  
  markMessagesAsRead: (roomId) => {
    const messages = get().messages;
    const roomMessages = messages[roomId] || [];
    const currentUserId = StorageService.getUser()?.id;
    
    if (!currentUserId) return;
    
    const updatedMessages = roomMessages.map((msg) => {
      if (msg.receiverId === currentUserId && !msg.isRead) {
        return { ...msg, isRead: true };
      }
      return msg;
    });
    
    set({
      messages: {
        ...messages,
        [roomId]: updatedMessages,
      },
    });
  },
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  hasTypingUser: (roomId) => {
    const typingUsers = get().typingUsers;
    const roomTyping = typingUsers[roomId] || {};
    const currentUserId = StorageService.getUser()?.id;
    
    return Object.keys(roomTyping).some(
      (userId) => userId !== String(currentUserId) && roomTyping[userId]
    );
  },
  
  getTypingUsers: (roomId) => {
    const typingUsers = get().typingUsers;
    const roomTyping = typingUsers[roomId] || {};
    const currentUserId = StorageService.getUser()?.id;
    
    return Object.keys(roomTyping).filter(
      (userId) => userId !== String(currentUserId) && roomTyping[userId]
    );
  },
  
  reset: () => {
    set({
      chatRooms: [],
      currentRoomId: null,
      messages: {},
      isConnected: false,
      socket: null,
      typingUsers: {},
      onlineUsers: {},
      isTyping: false,
      loading: false,
      error: null,
    });
  },
}));

export default useChatStore;

