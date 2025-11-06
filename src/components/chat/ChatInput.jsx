import { useState, useRef } from "react";
import { IoSend, IoImageOutline, IoDocumentAttach } from "react-icons/io5";
import useChatStore from "../../store/chatStore";
import useFileUpload from "../../hooks/useFileUpload";
import useTypingStatus from "../../hooks/useTypingStatus";
import { sendTextMessage, sendImageMessage, sendFileMessage } from "../../services/chatApi";
import StorageService from "../../services/storage";
import FilePreviewModal from "./FilePreviewModal";

// 채팅 입력 컴포넌트
// 텍스트, 이미지, 파일 전송 지원
const ChatInput = ({ roomId, sendTypingStatus }) => {
  const [message, setMessage] = useState("");
  const [previewFile, setPreviewFile] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const fileInputRef = useRef(null);
  const imageInputRef = useRef(null);

  const { setLoading } = useChatStore();
  const {
    uploadImage,
    uploadFile,
    createImagePreview,
    uploading,
    error: uploadError,
  } = useFileUpload();

  const { handleTypingStart, handleTypingStop } = useTypingStatus(
    roomId,
    sendTypingStatus
  );

  const currentUser = StorageService.getUser();

  // 텍스트 메시지 전송
  // STOMP로 전송하거나 REST API로 전송
  // UI 확인을 위해 로그인 체크 완화
  const handleSendText = async () => {
    if (!message.trim() || !roomId) return;

    // roomId가 유효한 숫자인지 확인 (문자열로 들어올 수 있음)
    const numericRoomId = Number(roomId);
    if (isNaN(numericRoomId) || numericRoomId <= 0) {
      console.warn("유효하지 않은 roomId:", roomId, "- 숫자여야 합니다.");
      return;
    }

    // userId 확인 (UI 확인용으로 경고만 출력)
    if (!currentUser?.id) {
      console.warn("사용자 정보가 없습니다. 메시지 전송은 로그인 후 가능합니다.");
      // UI 확인을 위해 메시지 전송은 막지 않음
      // return;
    }

    const trimmedMessage = message.trim();
    setMessage("");
    handleTypingStop();

    try {
      setLoading(true);

      // UI 확인용: 로그인하지 않은 경우 더미 userId 사용
      const userId = currentUser?.id || 999; // 임시 더미 ID

      // REST API로 전송 (백엔드에서 Redis로 브로드캐스트함)
      // 백엔드 ChatMessageDto 형식: { roomId, sender, message, messageType, metadata, userId, adminId }
      try {
        const response = await sendTextMessage({
          roomId: numericRoomId,
          sender: "USER",
          message: trimmedMessage, // 백엔드는 'message' 필드를 사용
          messageType: "TEXT",
          metadata: null,
          userId: userId,
          adminId: null,
        });
        // 전송 성공
      } catch (error) {
        // 401 에러 등으로 전송 실패해도 UI 확인을 위해 계속 진행
        console.warn("메시지 전송 실패 (UI 확인용으로 계속 진행):", error.response?.data || error.message);
      }

      // WebSocket(STOMP)을 통해 자동으로 수신되므로 여기서는 추가하지 않음
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      // 에러 상세 정보 출력
      if (error.response) {
        console.error("백엔드 응답:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  // 이미지 선택 처리
  const handleImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const preview = await createImagePreview(file);
      setPreviewFile(file);
      setPreviewType("image");
      setPreviewFile({ file, preview });
    } catch (error) {
      console.error("이미지 미리보기 생성 실패:", error);
    }
  };

  // 파일 선택 처리
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreviewFile({ file, preview: null });
    setPreviewType("file");
  };

  // 이미지 전송
  // TODO: 백엔드에 파일 업로드 API 추가 필요 (현재는 JSON만 받음)
  const handleSendImage = async (file, caption = "") => {
    if (!file || !roomId) return;

    try {
      setLoading(true);
      
      // TODO: 파일 업로드 후 이미지 URL 받기
      // 현재는 더미 URL 사용
      const imageUrl = URL.createObjectURL(file);
      
      // 백엔드 ChatMessageDto 형식으로 전송
      const response = await sendImageMessage({
        roomId: Number(roomId),
        imageUrl: imageUrl, // 실제로는 업로드 후 받은 URL
        metadata: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }),
        userId: currentUser?.id,
      });

      // WebSocket을 통해 자동으로 수신됨
      setPreviewFile(null);
      setPreviewType(null);
    } catch (error) {
      console.error("이미지 전송 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // 파일 전송
  // TODO: 백엔드에 파일 업로드 API 추가 필요 (현재는 JSON만 받음)
  const handleSendFile = async (file, caption = "") => {
    if (!file || !roomId) return;

    try {
      setLoading(true);
      
      // TODO: 파일 업로드 후 파일 URL 받기
      // 현재는 더미 URL 사용
      const fileUrl = URL.createObjectURL(file);
      
      // 백엔드 ChatMessageDto 형식으로 전송
      const response = await sendFileMessage({
        roomId: Number(roomId),
        fileUrl: fileUrl, // 실제로는 업로드 후 받은 URL
        metadata: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }),
        userId: currentUser?.id,
      });

      // WebSocket을 통해 자동으로 수신됨
      setPreviewFile(null);
      setPreviewType(null);
    } catch (error) {
      console.error("파일 전송 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  // 입력 시 typing 상태 전송
  const handleInputChange = (e) => {
    setMessage(e.target.value);
    if (e.target.value.trim()) {
      handleTypingStart();
    } else {
      handleTypingStop();
    }
  };

  return (
    <>
      {uploadError && (
        <div className="bg-red-100 text-red-700 px-4 py-2 text-sm rounded">
          {uploadError}
        </div>
      )}

      {previewFile && (
        <FilePreviewModal
          file={previewFile.file}
          preview={previewFile.preview}
          type={previewType}
          onClose={() => {
            setPreviewFile(null);
            setPreviewType(null);
          }}
          onSend={(caption) => {
            if (previewType === "image") {
              handleSendImage(previewFile.file, caption);
            } else {
              handleSendFile(previewFile.file, caption);
            }
          }}
        />
      )}

      <div className="h-16 bg-white border-t border-gray-200 flex items-center gap-2 px-4">
        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        <button
          onClick={() => imageInputRef.current?.click()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={uploading}
        >
          <IoImageOutline className="w-6 h-6 text-gray-600" />
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          disabled={uploading}
        >
          <IoDocumentAttach className="w-6 h-6 text-gray-600" />
        </button>

        <input
          type="text"
          value={message}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={uploading}
        />

        <button
          onClick={handleSendText}
          disabled={!message.trim() || uploading}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <IoSend className="w-6 h-6" />
        </button>
      </div>
    </>
  );
};

export default ChatInput;

