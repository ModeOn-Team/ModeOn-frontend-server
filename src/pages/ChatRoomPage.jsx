import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessageList from "../components/chat/ChatMessageList";
import ChatInput from "../components/chat/ChatInput";
import useChatSocket from "../hooks/useChatSocket";
import useChatStore from "../store/chatStore";
import { getChatMessages } from "../services/chatApi";

// 1:1 채팅 상세 페이지
// 실시간 메시지 송수신 및 WebSocket 연결 관리
const ChatRoomPage = () => {
  const { roomId } = useParams();
  const {
    setCurrentRoomId,
    isConnected,
    loading,
    setMessages,
    setLoading,
  } = useChatStore();

  // roomId가 유효한 숫자인지 확인 (WebSocket 연결용)
  const roomIdNumber = roomId ? Number(roomId) : null;
  const validRoomId = roomIdNumber && !isNaN(roomIdNumber) ? String(roomIdNumber) : null;
  const { sendTypingStatus } = useChatSocket(validRoomId);
  const [initialLoad, setInitialLoad] = useState(false);

  // 초기 메시지 로드
  useEffect(() => {
    if (roomId && !initialLoad) {
      const loadMessages = async () => {
        try {
          setLoading(true);
          
          const numericRoomId = Number(roomId);
          if (isNaN(numericRoomId)) {
            console.error("유효하지 않은 roomId:", roomId);
            setLoading(false);
            return;
          }
          
          const messageList = await getChatMessages(numericRoomId);
          
          // 백엔드 ChatMessageDto를 프론트엔드 형식으로 변환
          const convertedMessages = messageList.map((msg) => ({
            id: msg.id || Date.now(),
            roomId: msg.roomId,
            senderId: msg.sender === "USER" ? msg.userId : msg.adminId,
            receiverId: msg.sender === "USER" ? msg.adminId : msg.userId,
            content: msg.message,
            messageType: msg.messageType,
            timestamp: msg.createdAt || new Date().toISOString(),
            isRead: false,
            sender: msg.sender,
            userId: msg.userId,
            adminId: msg.adminId,
            metadata: msg.metadata,
            ...(msg.messageType === "IMAGE" && { fileUrl: msg.message }),
            ...(msg.messageType === "FILE" && { 
              fileUrl: msg.message,
              fileName: msg.metadata ? JSON.parse(msg.metadata)?.fileName : null,
            }),
          }));
          
          // 메시지가 없을 경우 초기 환영 메시지 추가
          if (convertedMessages.length === 0) {
            const buttonMessage = {
              id: `buttons-${roomId}-${Date.now()}`,
              roomId: roomId,
              senderId: null,
              receiverId: null,
              content: `안녕하세요 모드온입니다 :)\n\n상담 운영시간\n월~금 : 9:00 ~ 18:00\n공휴일 휴무\n\n이 외 궁금하신 사항은 게시판에 남겨주시거나 상담원 연결 하기 선택후 문의주시면 순차적으로 안내해드리겠습니다\n\n궁금한 사항을 선택해주세요`,
              messageType: "SYSTEM_BUTTONS",
              timestamp: new Date().toISOString(),
              isRead: true,
              sender: "SYSTEM",
              userId: null,
              adminId: null,
              metadata: JSON.stringify({
                buttons: [
                  "입고 및 배송 문의",
                  "배송전 변경 및 취소",
                  "교환/반품",
                  "입금확인",
                  "상담원 연결하기",
                  "이전 단계"
                ]
              }),
            };
            convertedMessages.push(buttonMessage);
          }
          
          setMessages(roomId, convertedMessages);
          setInitialLoad(true);
        } catch (error) {
          console.error("메시지 로드 실패:", error);
        } finally {
          setLoading(false);
        }
      };

      loadMessages();
    }
  }, [roomId, initialLoad, setMessages, setLoading]);

  useEffect(() => {
    if (roomId) {
      setCurrentRoomId(roomId);
    }

    return () => {
      // 페이지 이탈 시 정리
      setCurrentRoomId(null);
      setInitialLoad(false);
    };
  }, [roomId, setCurrentRoomId]);

  // 더미 데이터: 실제로는 백엔드에서 상대방 정보를 가져와야 함
  const otherUser = {
    id: 10,
    username: "관리자",
    fullName: "판매자",
    profileImageUrl: null, // 프로필 이미지 없음 (기본 아바타 사용)
  };

  // WebSocket 연결 상태 확인
  if (validRoomId && !isConnected && !loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-2">연결 중...</p>
          <p className="text-sm text-gray-400">WebSocket 연결을 시도하고 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader roomId={roomId} otherUser={otherUser} />
      
      <div className="flex-1 overflow-hidden">
        <ChatMessageList roomId={roomId} />
      </div>

      <ChatInput roomId={validRoomId} sendTypingStatus={sendTypingStatus} />
    </div>
  );
};

export default ChatRoomPage;

