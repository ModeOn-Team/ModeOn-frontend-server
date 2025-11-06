import { useEffect, useRef } from "react";
import { formatChatTime } from "../../utils/timeFormatter";
import useChatStore from "../../store/chatStore";
import StorageService from "../../services/storage";
import TypingIndicator from "./TypingIndicator";

// 채팅 메시지 리스트 컴포넌트
// 메시지 타입별 렌더링 (TEXT, IMAGE, FILE)
const ChatMessageList = ({ roomId }) => {
  const { messages, hasTypingUser } = useChatStore();
  const messagesEndRef = useRef(null);
  const currentUserId = StorageService.getUser()?.id;

  const roomMessages = messages[roomId] || [];

  // 새 메시지 시 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [roomMessages]);

  // 버튼 클릭 핸들러
  const handleButtonClick = (buttonText) => {
    // TODO: 버튼 클릭 시 처리 로직 (메시지 전송 또는 다른 액션)
    console.log("버튼 클릭:", buttonText);
  };

  // 메시지 렌더링
  const renderMessage = (message) => {
    const isOwnMessage = message.senderId === currentUserId;
    const isSystemMessage = message.messageType === "SYSTEM";
    const isSystemButtons = message.messageType === "SYSTEM_BUTTONS";

    // 시스템 메시지는 중앙 정렬로 표시
    if (isSystemMessage) {
      return (
        <div key={message.id} className="flex justify-center mb-4">
          <div className="max-w-md px-4 py-3 rounded-lg bg-blue-50 border border-blue-200 text-gray-700 text-center">
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {message.content}
            </p>
          </div>
        </div>
      );
    }

    // 시스템 버튼 메시지
    if (isSystemButtons) {
      let buttons = [];
      try {
        if (message.metadata) {
          const metadata = typeof message.metadata === 'string' 
            ? JSON.parse(message.metadata) 
            : message.metadata;
          buttons = metadata.buttons || [];
        }
      } catch (error) {
        console.error("버튼 메타데이터 파싱 실패:", error);
      }

      return (
        <div key={message.id} className="flex justify-start mb-4">
          <div className="max-w-md px-4 py-3 rounded-lg bg-gray-200 text-gray-800">
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed mb-3">
              {message.content}
            </p>
            {buttons.length > 0 && (
              <div className="flex flex-col gap-2">
                {buttons.map((buttonText, index) => (
                  <button
                    key={index}
                    onClick={() => handleButtonClick(buttonText)}
                    className="w-full px-4 py-2.5 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors text-left"
                  >
                    {buttonText}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div
        key={message.id}
        className={`flex mb-4 ${isOwnMessage ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
            isOwnMessage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {message.messageType === "IMAGE" && message.fileUrl && (
            <div className="mb-2">
              <img
                src={message.fileUrl}
                alt="이미지"
                className="max-w-full h-auto rounded-lg cursor-pointer"
                onClick={() => window.open(message.fileUrl, "_blank")}
              />
              {message.content && (
                <p className="mt-2 text-sm">{message.content}</p>
              )}
            </div>
          )}

          {message.messageType === "FILE" && (
            <div className="mb-2">
              <a
                href={message.fileUrl}
                download={message.fileName}
                className="flex items-center gap-2 p-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {message.fileName || "파일"}
                  </p>
                  <p className="text-xs opacity-75">다운로드</p>
                </div>
              </a>
              {message.content && (
                <p className="mt-2 text-sm">{message.content}</p>
              )}
            </div>
          )}

          {message.messageType === "TEXT" && (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}

          <div
            className={`text-xs mt-1 ${
              isOwnMessage ? "text-blue-100" : "text-gray-500"
            }`}
          >
            {formatChatTime(message.timestamp)}
            {isOwnMessage && (
              <span className="ml-1">
                {message.isRead ? "✓✓" : "✓"}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-2">
      {roomMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>메시지를 불러오는 중...</p>
        </div>
      ) : (
        <>
          {roomMessages.map(renderMessage)}
          {hasTypingUser(roomId) && <TypingIndicator />}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;

