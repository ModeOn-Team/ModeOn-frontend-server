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
  const isAdmin = currentUser?.role === "ROLE_ADMIN";

  // 텍스트 메시지 전송
  // 백엔드 인증/인가 강화에 따라 실제 사용자 ID만 사용
  const handleSendText = async () => {
    if (!message.trim() || !roomId) return;

    // 로그인 확인
    if (!currentUser?.id) {
      alert("로그인이 필요합니다. 메시지를 전송할 수 없습니다.");
      return;
    }

    // roomId가 유효한 숫자인지 확인
    const numericRoomId = Number(roomId);
    if (isNaN(numericRoomId) || numericRoomId <= 0) {
      console.warn("유효하지 않은 roomId:", roomId);
      alert("유효하지 않은 채팅방입니다.");
      return;
    }

    const trimmedMessage = message.trim();
    setMessage("");
    handleTypingStop();

    try {
      setLoading(true);

      // 백엔드 인증/인가 강화: 실제 로그인한 사용자 ID만 사용
      // 관리자인 경우 sender: "ADMIN", adminId 설정
      // 일반 사용자인 경우 sender: "USER", userId 설정
      const response = await sendTextMessage({
        roomId: numericRoomId,
        sender: isAdmin ? "ADMIN" : "USER",
        message: trimmedMessage,
        messageType: "TEXT",
        metadata: null,
        userId: isAdmin ? null : currentUser.id, // 일반 사용자만 userId 설정
        adminId: isAdmin ? currentUser.id : null, // 관리자만 adminId 설정
      });

      // 전송 성공
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      
      // 403 Forbidden 에러 처리
      if (error.response?.status === 403) {
        const errorMessage = error.response?.data?.message || "메시지를 전송할 권한이 없습니다.";
        alert(errorMessage);
        return;
      }
      
      // 400 Bad Request 에러 처리
      if (error.response?.status === 400) {
        const errorMessage = error.response?.data?.message || "잘못된 요청입니다.";
        alert(errorMessage);
        return;
      }
      
      // 기타 에러
      alert(error.response?.data?.message || "메시지 전송에 실패했습니다. 다시 시도해주세요.");
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

    if (!currentUser?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setLoading(true);
      
      // TODO: 파일 업로드 후 이미지 URL 받기
      // 현재는 더미 URL 사용
      const imageUrl = URL.createObjectURL(file);
      
      // 백엔드 인증/인가 강화: 실제 사용자 ID만 사용
      const response = await sendImageMessage({
        roomId: Number(roomId),
        imageUrl: imageUrl, // 실제로는 업로드 후 받은 URL
        metadata: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }),
        sender: isAdmin ? "ADMIN" : "USER",
        userId: isAdmin ? null : currentUser.id,
        adminId: isAdmin ? currentUser.id : null,
      });

      // WebSocket을 통해 자동으로 수신됨
      setPreviewFile(null);
      setPreviewType(null);
    } catch (error) {
      console.error("이미지 전송 실패:", error);
      
      if (error.response?.status === 403) {
        alert(error.response?.data?.message || "이미지를 전송할 권한이 없습니다.");
      } else if (error.response?.status === 400) {
        alert(error.response?.data?.message || "잘못된 요청입니다.");
      } else {
        alert("이미지 전송에 실패했습니다. 다시 시도해주세요.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 파일 전송
  // TODO: 백엔드에 파일 업로드 API 추가 필요 (현재는 JSON만 받음)
  const handleSendFile = async (file, caption = "") => {
    if (!file || !roomId) return;

    if (!currentUser?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    try {
      setLoading(true);
      
      // TODO: 파일 업로드 후 파일 URL 받기
      // 현재는 더미 URL 사용
      const fileUrl = URL.createObjectURL(file);
      
      // 백엔드 인증/인가 강화: 실제 사용자 ID만 사용
      const response = await sendFileMessage({
        roomId: Number(roomId),
        fileUrl: fileUrl, // 실제로는 업로드 후 받은 URL
        metadata: JSON.stringify({
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }),
        sender: isAdmin ? "ADMIN" : "USER",
        userId: isAdmin ? null : currentUser.id,
        adminId: isAdmin ? currentUser.id : null,
      });

      // WebSocket을 통해 자동으로 수신됨
      setPreviewFile(null);
      setPreviewType(null);
    } catch (error) {
      console.error("파일 전송 실패:", error);
      
      if (error.response?.status === 403) {
        alert(error.response?.data?.message || "파일을 전송할 권한이 없습니다.");
      } else if (error.response?.status === 400) {
        alert(error.response?.data?.message || "잘못된 요청입니다.");
      } else {
        alert("파일 전송에 실패했습니다. 다시 시도해주세요.");
      }
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

