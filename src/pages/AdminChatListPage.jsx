import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime } from "../utils/timeFormatter";
import { getAdminChatList } from "../services/chatApi";
import useChatStore from "../store/chatStore";

// 관리자용 채팅 목록 페이지
// 전체 유저의 채팅방 목록 조회
const AdminChatListPage = () => {
  const navigate = useNavigate();
  const { setCurrentRoomId } = useChatStore();
  const [chatRooms, setChatRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAdminChatList();
  }, []);

  // 관리자용 채팅 목록 로드
  const loadAdminChatList = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAdminChatList();
      console.log("관리자 채팅 목록 API 응답:", response);
      
      const rooms = response || [];
      console.log("받은 채팅방 개수:", rooms.length);
      
      // 첫 번째 채팅방의 구조 확인
      if (rooms.length > 0) {
        console.log("첫 번째 채팅방 구조:", JSON.stringify(rooms[0], null, 2));
        console.log("첫 번째 채팅방 키 목록:", Object.keys(rooms[0]));
      }
      
      // 가상/테스트 사용자 필터링 (otherUser가 없거나 유효하지 않은 사용자 제외)
      const filteredRooms = rooms.filter((room) => {
        // otherUser가 없으면 제외
        if (!room.otherUser) {
          console.log("필터링됨: otherUser 없음", {
            roomId: room.roomId,
            userId: room.userId,
            keys: Object.keys(room)
          });
          return false;
        }
        
        // username과 fullName이 모두 없으면 제외
        if (!room.otherUser.username && !room.otherUser.fullName) {
          console.log("필터링됨: username과 fullName 모두 없음", room);
          return false;
        }
        
        // 가상 사용자 "modeon1101" 제외
        if (room.otherUser.username === "modeon1101" || room.otherUser.fullName === "modeon1101") {
          console.log("필터링됨: 가상 사용자 modeon1101", room);
          return false;
        }
        
        return true;
      });
      
      console.log("필터링 후 채팅방 개수:", filteredRooms.length);
      console.log("필터링 후 채팅방 데이터:", filteredRooms);
      
      setChatRooms(filteredRooms);
    } catch (err) {
      console.error("관리자 채팅 목록 로드 실패:", err);
      setError(err.response?.data?.message || "목록을 불러올 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 채팅방 선택
  const handleSelectRoom = async (roomId) => {
    const numericRoomId = Number(roomId);
    if (isNaN(numericRoomId)) {
      console.error("유효하지 않은 roomId:", roomId);
      return;
    }

    setCurrentRoomId(String(numericRoomId));
    navigate(`/chat/${numericRoomId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-2">{error}</p>
          <button
            onClick={loadAdminChatList}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">관리자 채팅 목록</h1>
        <button
          onClick={loadAdminChatList}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          새로고침
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="space-y-0 divide-y">
          {chatRooms.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>채팅방이 없습니다.</p>
            </div>
          ) : (
            chatRooms.map((room) => (
              <div
                key={room.id}
                onClick={() => handleSelectRoom(room.roomId)}
                className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
              >
                {room.otherUser?.profileImageUrl ? (
                  <img
                    src={room.otherUser.profileImageUrl}
                    alt={room.otherUser?.username || room.otherUser?.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
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
                  {(room.otherUser?.username || room.otherUser?.fullName)?.[0]?.toUpperCase() || "?"}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {room.otherUser?.username || room.otherUser?.fullName || "사용자"}
                      </h3>
                    </div>
                    <div className="text-right">
                      {room.lastMessageTime && (
                        <span className="text-xs text-gray-500">
                          {formatRelativeTime(room.lastMessageTime)}
                        </span>
                      )}
                      {room.unreadCount > 0 && (
                        <span className="block mt-1 bg-blue-500 text-white text-xs px-2 py-1 rounded-full ml-auto w-fit">
                          {room.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {room.lastMessage && (
                    <p className="text-sm text-gray-600 truncate">
                      {room.lastMessage}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminChatListPage;

