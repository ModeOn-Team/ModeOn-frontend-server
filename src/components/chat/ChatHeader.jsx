import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import useChatStore from "../../store/chatStore";
import StorageService from "../../services/storage";

// 채팅방 헤더 컴포넌트
// 상대방 정보, 연결 상태, 통화 버튼 등 표시
const ChatHeader = ({ roomId, otherUser }) => {
  const navigate = useNavigate();
  const { onlineUsers } = useChatStore();
  const currentUserId = StorageService.getUser()?.id;

  const isOnline =
    roomId && onlineUsers[roomId]?.includes(otherUser?.id);

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/chat")}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <IoArrowBack className="w-6 h-6 text-gray-700" />
        </button>

        <div className="flex items-center gap-3">
          <div className="relative">
            {otherUser?.profileImageUrl ? (
              <img
                src={otherUser.profileImageUrl}
                alt={otherUser?.username || "User"}
                className="w-10 h-10 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
            ) : null}
            <div
              className={`w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-sm ${
                otherUser?.profileImageUrl ? "hidden" : ""
              }`}
            >
              {otherUser?.username?.[0]?.toUpperCase() || otherUser?.fullName?.[0]?.toUpperCase() || "?"}
            </div>
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>

          <div>
            <h2 className="font-semibold text-gray-800">
              {otherUser?.username || otherUser?.fullName || "Unknown User"}
            </h2>
            {isOnline ? (
              <p className="text-xs text-green-600">온라인</p>
            ) : (
              <p className="text-xs text-gray-500">오프라인</p>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;

