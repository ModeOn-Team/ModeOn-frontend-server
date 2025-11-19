import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessageList from "../components/chat/ChatMessageList";
import ChatInput from "../components/chat/ChatInput";
import useChatSocket from "../hooks/useChatSocket";
import useChatStore from "../store/chatStore";
import { getChatMessages, getAdminChatList, validateChatRoomAccess } from "../services/chatApi";
import StorageService from "../services/storage";

// 1:1 채팅 상세 페이지
// 실시간 메시지 송수신 및 WebSocket 연결 관리
const ChatRoomPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const {
    setCurrentRoomId,
    isConnected,
    loading,
    error,
    setMessages,
    setLoading,
  } = useChatStore();

  // roomId가 유효한 숫자인지 확인 (WebSocket 연결용)
  const roomIdNumber = roomId ? Number(roomId) : null;
  const validRoomId = roomIdNumber && !isNaN(roomIdNumber) ? String(roomIdNumber) : null;
  const { sendTypingStatus } = useChatSocket(validRoomId);
  const [initialLoad, setInitialLoad] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [isValidating, setIsValidating] = useState(true);
  const currentUser = StorageService.getUser();
  const isAdmin = currentUser?.role === "ROLE_ADMIN";

  // 채팅방 접근 권한 검증
  useEffect(() => {
    const validateAccess = async () => {
      if (!roomId) {
        setIsValidating(false);
        setAccessDenied(true);
        return;
      }

      const numericRoomId = Number(roomId);
      if (isNaN(numericRoomId)) {
        setIsValidating(false);
        setAccessDenied(true);
        return;
      }

      try {
        const hasAccess = await validateChatRoomAccess(numericRoomId);
        if (!hasAccess) {
          setAccessDenied(true);
          setIsValidating(false);
          // 3초 후 채팅 목록으로 리다이렉트
          setTimeout(() => {
            navigate("/chat", { replace: true });
          }, 3000);
          return;
        }
        setIsValidating(false);
      } catch (error) {
        console.error("채팅방 접근 권한 검증 실패:", error);
        if (error.response?.status === 403 || error.response?.status === 404) {
          setAccessDenied(true);
          setIsValidating(false);
          setTimeout(() => {
            navigate("/chat", { replace: true });
          }, 3000);
        } else {
          setIsValidating(false);
        }
      }
    };

    validateAccess();
  }, [roomId, navigate]);

  // 초기 메시지 로드
  useEffect(() => {
    if (roomId && !initialLoad && !accessDenied && !isValidating) {
      const loadMessages = async () => {
        try {
          setLoading(true);
          
          const numericRoomId = Number(roomId);
          if (isNaN(numericRoomId)) {
            console.error("유효하지 않은 roomId:", roomId);
            setLoading(false);
            return;
          }
          
          // 일반 사용자인 경우: 이전 메시지 히스토리를 불러오지 않고 안내 메시지만 표시
          if (!isAdmin) {
            const initialMessageContent = `안녕하세요 모드온입니다 :)\n\n상담 운영시간\n월~금 : 9:00 ~ 18:00\n공휴일 휴무\n\n이 외 궁금하신 사항은 게시판에 남겨주시면 순차적으로 안내해드리겠습니다\n\n궁금한 사항을 선택해주세요`;
            
            const buttonMessage = {
              id: `buttons-${roomId}-${Date.now()}`,
              roomId: roomId,
              senderId: null,
              receiverId: null,
              content: initialMessageContent,
              messageType: "SYSTEM_BUTTONS",
              timestamp: new Date(0).toISOString(), // 최상단에 고정
              isRead: true,
              sender: "ADMIN",
              userId: null,
              adminId: null,
              metadata: JSON.stringify({
                buttons: [
                  "입고 및 배송 문의",
                  "배송전 변경 및 취소",
                  "교환/반품"
                ]
              }),
            };
            
            // 안내 메시지만 설정 (이전 메시지 히스토리 불러오지 않음)
            setMessages(roomId, [buttonMessage]);
            setInitialLoad(true);
            setLoading(false);
            return;
          }
          
          // 관리자인 경우: 기존처럼 모든 메시지 히스토리 불러오기
          const messageList = await getChatMessages(numericRoomId);
          
          // 백엔드 ChatMessageDto를 프론트엔드 형식으로 변환
          const convertedMessages = messageList.map((msg, index) => {
            // 백엔드에서 id를 보장하므로 id가 없으면 경고 로그만 출력
            if (!msg.id) {
              console.warn("메시지에 id가 없습니다:", msg);
            }
            
            return {
              id: msg.id || `msg-${msg.roomId}-${msg.createdAt || Date.now()}-${index}`,
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
            };
          });
          
          setMessages(roomId, convertedMessages);
          setInitialLoad(true);
        } catch (error) {
          console.error("메시지 로드 실패:", error);
          
          // 403 Forbidden: 접근 권한 없음
          if (error.response?.status === 403) {
            const errorMessage = error.response?.data?.message || "해당 채팅방의 메시지를 조회할 권한이 없습니다.";
            useChatStore.getState().setError(errorMessage);
            setAccessDenied(true);
            setTimeout(() => {
              navigate("/chat", { replace: true });
            }, 3000);
          } 
          // 404 Not Found: 채팅방 없음
          else if (error.response?.status === 404) {
            setAccessDenied(true);
            setTimeout(() => {
              navigate("/chat", { replace: true });
            }, 3000);
          }
          // 기타 에러
          else {
            const errorMessage = error.response?.data?.message || "메시지를 불러오는데 실패했습니다.";
            useChatStore.getState().setError(errorMessage);
          }
        } finally {
          setLoading(false);
        }
      };

      loadMessages();
    }
  }, [roomId, initialLoad, setMessages, setLoading, accessDenied, isValidating, navigate, isAdmin]);

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

  // 채팅방 정보 및 상대방 정보 가져오기
  useEffect(() => {
    if (roomId) {
      const loadChatRoomInfo = async () => {
        try {
          const numericRoomId = Number(roomId);
          if (isNaN(numericRoomId)) {
            return;
          }
          
          if (isAdmin) {
            // 관리자: 관리자 채팅 목록에서 현재 채팅방 정보 찾기
            const chatList = await getAdminChatList();
            const currentRoom = chatList.find(room => room.roomId === numericRoomId);
            
            if (currentRoom) {
              setRoomInfo(currentRoom);
              if (currentRoom.otherUser) {
                // 상대방(고객) 정보 설정
                setOtherUser(currentRoom.otherUser);
              } else {
                // 기본값 설정
                setOtherUser({
                  id: null,
                  username: "고객",
                  fullName: "고객",
                  profileImageUrl: null,
                });
              }
            } else {
              // 기본값 설정
              setOtherUser({
                id: null,
                username: "고객",
                fullName: "고객",
                profileImageUrl: null,
              });
            }
          } else {
            // 일반 사용자: 모드온 정보 표시
            setOtherUser({
              id: null,
              username: "모드온",
              fullName: "모드온",
              profileImageUrl: null,
            });
          }
        } catch (error) {
          console.error("채팅방 정보 로드 실패:", error);
          // 기본값 설정
          if (isAdmin) {
            setOtherUser({
              id: null,
              username: "고객",
              fullName: "고객",
              profileImageUrl: null,
            });
          } else {
            setOtherUser({
              id: null,
              username: "모드온",
              fullName: "모드온",
              profileImageUrl: null,
            });
          }
        }
      };
      
      loadChatRoomInfo();
    }
  }, [roomId, isAdmin]);

  // 접근 권한 검증 중
  if (isValidating) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-2">접근 권한 확인 중...</p>
          <p className="text-sm text-gray-400">채팅방 정보를 확인하고 있습니다.</p>
        </div>
      </div>
    );
  }

  // 접근 거부
  if (accessDenied) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-2 font-semibold">접근 권한이 없습니다</p>
          <p className="text-sm text-gray-600 mb-4">
            이 채팅방에 접근할 권한이 없습니다.
          </p>
          <p className="text-xs text-gray-400">
            3초 후 채팅 목록으로 이동합니다...
          </p>
        </div>
      </div>
    );
  }

  // WebSocket 연결 상태 확인
  if (validRoomId && !isConnected && !loading) {
    const isAuthError = error?.includes("인증에 실패했습니다") || error?.includes("로그인");
    
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          {error ? (
            <>
              <p className="text-red-500 mb-2 font-semibold">연결 실패</p>
              <p className="text-sm text-gray-600 mb-4">{error}</p>
              {isAuthError ? (
                <button
                  onClick={() => window.location.href = "/auth"}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  로그인 페이지로 이동
                </button>
              ) : (
                <p className="text-xs text-gray-400">
                  백엔드 서버가 실행 중인지 확인하거나 백엔드 개발자에게 문의하세요.
                </p>
              )}
            </>
          ) : (
            <>
              <p className="text-gray-500 mb-2">연결 중...</p>
              <p className="text-sm text-gray-400">WebSocket 연결을 시도하고 있습니다.</p>
            </>
          )}
        </div>
      </div>
    );
  }

  // otherUser가 로드될 때까지 대기
  if (!otherUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <ChatHeader roomId={roomId} otherUser={otherUser} />
      
      <div className="flex-1 min-h-0">
        <ChatMessageList roomId={roomId} />
      </div>

      <ChatInput roomId={validRoomId} sendTypingStatus={sendTypingStatus} />
    </div>
  );
};

export default ChatRoomPage;