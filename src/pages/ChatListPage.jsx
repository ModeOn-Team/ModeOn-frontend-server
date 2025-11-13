import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime } from "../utils/timeFormatter";
import useChatStore from "../store/chatStore";
import useAuthStore from "../store/authStore";
import { joinChatRoom, getChatMessages } from "../services/chatApi";
import StorageService from "../services/storage";

// 채팅방 목록 페이지
// 사용자가 속한 모든 채팅방 목록 표시
const ChatListPage = () => {
  const navigate = useNavigate();
  const { chatRooms, setChatRooms, messages, setCurrentRoomId } = useChatStore();
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const retryCountRef = useRef(0);
  const maxRetries = 3;

  // 채팅방 생성하고 바로 열기
  const createAndOpenChatRoom = async (isRetry = false) => {
    try {
      if (!isRetry) {
        setError(null);
        retryCountRef.current = 0;
      }
      setLoading(true);
      
      if (!user?.id) {
        setError("로그인이 필요합니다.");
        setLoading(false);
        return;
      }

      const response = await joinChatRoom(user.id);
      console.log("채팅방 생성 응답:", response);
      if (response?.roomId) {
        setCurrentRoomId(String(response.roomId));
        navigate(`/chat/${response.roomId}`);
      } else {
        setError("채팅방 생성 실패: roomId를 받지 못했습니다.");
        setLoading(false);
      }
    } catch (error) {
      // 네트워크 에러만 콘솔에 간단히 로깅 (중복 로깅 방지)
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        // 첫 번째 시도만 상세 로깅
        if (retryCountRef.current === 0) {
          console.warn("서버 연결 실패:", error.message);
        }
      } else {
        console.error("채팅방 생성 실패:", error);
      }
      
      // 네트워크 에러 처리
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        // 자동 재시도 (최대 3회)
        if (retryCountRef.current < maxRetries) {
          retryCountRef.current++;
          const delay = 2000 * retryCountRef.current; // 2초, 4초, 6초
          
          console.log(`서버 연결 재시도 ${retryCountRef.current}/${maxRetries} (${delay}ms 후)`);
          setError(`서버 연결 실패. 재시도 중... (${retryCountRef.current}/${maxRetries})`);
          
          setTimeout(() => {
            createAndOpenChatRoom(true);
          }, delay);
          return;
        }
        
        setError("서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.");
      } else if (error.response?.status === 401) {
        setError("인증이 필요합니다. 다시 로그인해주세요.");
      } else if (error.response?.status === 403) {
        setError("접근 권한이 없습니다.");
      } else if (error.response?.status >= 500) {
        console.error("서버 오류 상세:", {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          message: error.message
        });
        
        // 백엔드에서 반환한 에러 메시지 확인
        const errorData = error.response?.data;
        let serverMessage = "";
        
        if (errorData) {
          if (typeof errorData === "string") {
            serverMessage = errorData;
          } else if (errorData.message) {
            serverMessage = errorData.message;
          } else if (errorData.error) {
            serverMessage = errorData.error;
          } else if (errorData.errorMessage) {
            serverMessage = errorData.errorMessage;
          }
        }
        
        const errorText = serverMessage 
          ? `서버 오류가 발생했습니다. (${error.response?.status}): ${serverMessage}`
          : `서버 오류가 발생했습니다. (${error.response?.status}) 백엔드 서버 로그를 확인해주세요.`;
        
        setError(errorText);
      } else {
        setError(error.response?.data?.message || error.message || "채팅방 생성에 실패했습니다.");
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    const initializeChat = async () => {
      try {
        setLoading(true);
        setError(null);
        setChatRooms([]);
        
        // 채팅방이 없으면 자동으로 채팅방 생성하고 바로 채팅창 열기
        if (user?.id) {
          await createAndOpenChatRoom();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error("채팅 초기화 실패:", error);
        setError("채팅 초기화에 실패했습니다.");
        setLoading(false);
      }
    };

    initializeChat();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // 채팅방 목록 로드
  const loadChatRooms = async () => {
    try {
      setLoading(true);
      setChatRooms([]);
    } catch (error) {
      console.error("채팅방 목록 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 채팅방 선택
  const handleSelectRoom = async (roomId) => {
    try {
      setError(null);
      
      if (!user?.id) {
        setError("로그인이 필요합니다.");
        return;
      }

      // 최초 진입 시 채팅방 생성 (백엔드: POST /api/chating/join?userId={userId})
      const response = await joinChatRoom(user.id);

      if (response?.roomId) {
        setCurrentRoomId(response.roomId);
        navigate(`/chat/${response.roomId}`);
      } else {
        setError("채팅방 생성 실패: roomId를 받지 못했습니다.");
      }
    } catch (error) {
      console.error("채팅방 진입 실패:", error);
      
      // 네트워크 에러 처리
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        setError("서버에 연결할 수 없습니다. 백엔드 서버가 실행 중인지 확인해주세요.");
      } else if (error.response?.status === 401) {
        setError("인증이 필요합니다. 다시 로그인해주세요.");
      } else if (error.response?.status === 403) {
        setError("접근 권한이 없습니다.");
      } else if (error.response?.status >= 500) {
        setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
      } else {
        setError(error.response?.data?.message || error.message || "채팅방 진입에 실패했습니다.");
      }
    }
  };

  // 마지막 메시지 가져오기
  const getLastMessage = (roomId) => {
    const roomMessages = messages[roomId] || [];
    if (roomMessages.length > 0) {
      return roomMessages[roomMessages.length - 1];
    }
    return null;
  };

  // 읽지 않은 메시지 개수
  const getUnreadCount = (roomId) => {
    const roomMessages = messages[roomId] || [];
    const currentUserId = StorageService.getUser()?.id;
    return roomMessages.filter(
      (msg) => msg.receiverId === currentUserId && !msg.isRead
    ).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-gray-500 mb-2">로딩 중...</p>
          <p className="text-sm text-gray-400">채팅방을 준비하고 있습니다.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">채팅</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-red-800 font-semibold mb-1">오류 발생</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {chatRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              {error ? "채팅방을 불러올 수 없습니다." : "채팅방이 없습니다."}
            </p>
            <button
              onClick={createAndOpenChatRoom}
              disabled={loading}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "생성 중..." : "채팅 시작하기"}
            </button>
            {error && (
              <p className="mt-4 text-xs text-gray-400">
                백엔드 서버가 실행 중인지 확인하거나 네트워크 연결을 확인해주세요.
              </p>
            )}
          </div>
        ) : (
          chatRooms.map((room) => {
            const lastMessage = getLastMessage(room.roomId) || room.lastMessage;
            const unreadCount = getUnreadCount(room.roomId) || room.unreadCount;

            return (
              <div
                key={room.id}
                onClick={() => handleSelectRoom(room.roomId)}
                className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow"
              >
                {room.otherUser?.profileImageUrl ? (
                  <img
                    src={room.otherUser.profileImageUrl}
                    alt={room.otherUser?.username}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                      // 이미지 로드 실패 시 기본 아바타로 대체
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold ${
                    room.otherUser?.profileImageUrl ? "hidden" : ""
                  }`}
                >
                  {room.otherUser?.username?.[0]?.toUpperCase() || "?"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {room.otherUser?.username || room.otherUser?.fullName}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {lastMessage?.timestamp
                        ? formatRelativeTime(lastMessage.timestamp)
                        : formatRelativeTime(room.lastMessageTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 truncate">
                      {lastMessage?.content || lastMessage}
                    </p>
                    {unreadCount > 0 && (
                      <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatListPage;

