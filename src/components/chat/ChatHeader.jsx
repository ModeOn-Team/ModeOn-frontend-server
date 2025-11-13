// 채팅방 헤더 컴포넌트
// 상대방 정보 표시
const ChatHeader = ({ roomId, otherUser }) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-10">
      <div className="flex items-center gap-3">
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
          </div>

          <div>
            <h2 className="font-semibold text-gray-800">
              {otherUser?.username || otherUser?.fullName || "Unknown User"}
            </h2>
          </div>
        </div>
      </div>
    </header>
  );
};

export default ChatHeader;

