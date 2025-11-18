import { useCallback } from "react";
import useChatStore from "../../store/chatStore";
import StorageService from "../../services/storage";

// 채팅방 헤더 컴포넌트
// 상대방 정보 표시
const ChatHeader = ({ roomId, otherUser }) => {
  const { setMessages } = useChatStore();
  const currentUser = StorageService.getUser();
  const isAdmin = currentUser?.role === "ROLE_ADMIN";

  // 새로고침 버튼 클릭 핸들러 - F5처럼 페이지 새로고침 (백엔드에서 원래 메시지 다시 불러옴)
  const handleRefresh = useCallback(() => {
    // F5 새로고침처럼 현재 페이지를 새로고침
    // 백엔드에서 원래 메시지 히스토리를 다시 불러옴
    window.location.reload();
  }, []);

  // 휴지통 버튼 클릭 핸들러 - 프론트엔드에서만 메시지 삭제 (하드 리셋)
  const handleHardReset = useCallback(() => {
    if (!roomId) return;

    if (!confirm("모든 채팅 내용을 삭제하시겠습니까? 새로고침하면 원래대로 돌아옵니다.")) {
      return;
    }

    const stringRoomId = String(roomId);
    const initialMessageContent = `안녕하세요 모드온입니다 :)\n\n상담 운영시간\n월~금 : 9:00 ~ 18:00\n공휴일 휴무\n\n이 외 궁금하신 사항은 게시판에 남겨주시면 순차적으로 안내해드리겠습니다\n\n궁금한 사항을 선택해주세요`;

    // 초기 안내 메시지만 생성
    const initialMessage = {
      id: `buttons-${roomId}-${Date.now()}`,
      roomId: stringRoomId,
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

    // 모든 메시지를 삭제하고 초기 안내 메시지만 설정 (프론트엔드에서만)
    setMessages(stringRoomId, [initialMessage]);
  }, [roomId, setMessages]);

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
      
      {/* 버튼 그룹 */}
      <div className="flex items-center gap-2">
        {/* 휴지통 버튼 (프론트엔드에서만 메시지 삭제) */}
        <button
          onClick={handleHardReset}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="채팅 내용 삭제 (새로고침하면 복구됨)"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
        
        {/* 새로고침 버튼 (F5처럼 페이지 새로고침) */}
        <button
          onClick={handleRefresh}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          title="페이지 새로고침 (원래 메시지 복구)"
        >
          <svg
            className="w-5 h-5 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>
    </header>
  );
};

export default ChatHeader;

