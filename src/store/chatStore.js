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
    
    if (roomMessages.some((m) => m.id === message.id)) {
      return;
    }
    
    set({
      messages: {
        ...messages,
        [roomId]: [...roomMessages, message].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        ),
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

