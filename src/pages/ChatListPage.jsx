import { useEffect, useState } from "react";
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

  useEffect(() => {
    loadChatRooms();
  }, []);

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
      if (!user?.id) {
        console.error("로그인이 필요합니다.");
        return;
      }

      // 최초 진입 시 채팅방 생성 (백엔드: POST /api/chating/join?userId={userId})
      const response = await joinChatRoom(user.id);

      if (response?.roomId) {
        setCurrentRoomId(response.roomId);
        navigate(`/chat/${response.roomId}`);
      } else {
        console.error("채팅방 생성 실패: roomId를 받지 못했습니다.");
      }
    } catch (error) {
      console.error("채팅방 진입 실패:", error);
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
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">채팅</h1>

      <div className="space-y-2">
        {chatRooms.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>채팅방이 없습니다.</p>
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

