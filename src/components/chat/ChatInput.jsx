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
    console.log("handleSendText 호출됨", { message: message.trim(), roomId, currentUser });
    
    if (!message.trim() || !roomId) {
      console.warn("메시지 또는 roomId가 없음:", { message: message.trim(), roomId });
      return;
    }

    // 로그인 확인
    if (!currentUser?.id) {
      console.error("로그인되지 않음:", currentUser);
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
      console.log("메시지 전송 시작:", {
        roomId: numericRoomId,
        sender: isAdmin ? "ADMIN" : "USER",
        message: trimmedMessage,
        userId: isAdmin ? null : currentUser.id,
        adminId: isAdmin ? currentUser.id : null,
      });

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

      console.log("메시지 전송 성공:", response);
      // 전송 성공
    } catch (error) {
      console.error("메시지 전송 실패:", error);
      console.error("에러 상세:", {
        message: error.message,
        response: error.response,
        status: error.response?.status,
        data: error.response?.data,
      });
      
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
      
      // 네트워크 에러 처리
      if (error.code === "ERR_NETWORK" || error.message === "Network Error") {
        alert("네트워크 오류가 발생했습니다. 백엔드 서버가 실행 중인지 확인해주세요.");
        return;
      }
      
      // 기타 에러
      alert(error.response?.data?.message || error.message || "메시지 전송에 실패했습니다. 다시 시도해주세요.");
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

    const numericRoomId = Number(roomId);
    const { addMessage } = useChatStore.getState();

    setLoading(true);
    
    // 이미지를 Base64로 변환하여 전송
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64Image = reader.result; // data:image/jpeg;base64,... 형식
        const imageUrl = base64Image; // Base64를 URL로 사용
        const stringRoomId = String(roomId);
        
        // 프론트엔드에서 즉시 메시지 추가 (임시)
        const tempMessageId = `temp-image-${Date.now()}`;
        const tempMessage = {
          id: tempMessageId,
          roomId: stringRoomId,
          senderId: currentUser.id,
          receiverId: null,
          content: caption || "",
          messageType: "IMAGE",
          timestamp: new Date().toISOString(),
          isRead: false,
          sender: isAdmin ? "ADMIN" : "USER",
          userId: isAdmin ? null : currentUser.id,
          adminId: isAdmin ? currentUser.id : null,
          fileUrl: imageUrl,
          metadata: JSON.stringify({
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
          }),
        };
        addMessage(stringRoomId, tempMessage);
        
        // 미리보기 닫기
        setPreviewFile(null);
        setPreviewType(null);
        
        try {
          // 백엔드 인증/인가 강화: 실제 사용자 ID만 사용
          // sendImageMessage는 message 필드에 이미지 URL을 넣음
          const response = await sendImageMessage({
            roomId: numericRoomId,
            imageUrl: imageUrl, // Base64 이미지
            message: imageUrl, // Base64 이미지를 message 필드에도 넣음 (백엔드 요구사항)
            metadata: JSON.stringify({
              fileName: file.name,
              fileSize: file.size,
              fileType: file.type,
              caption: caption || "",
            }),
            sender: isAdmin ? "ADMIN" : "USER",
            userId: isAdmin ? null : currentUser.id,
            adminId: isAdmin ? currentUser.id : null,
          });

          // WebSocket을 통해 자동으로 수신되면 임시 메시지가 대체됨
          setLoading(false);
        } catch (sendError) {
          console.error("이미지 전송 실패:", sendError);
          setLoading(false);
          
          if (sendError.response?.status === 403) {
            alert(sendError.response?.data?.message || "이미지를 전송할 권한이 없습니다.");
          } else if (sendError.response?.status === 400) {
            alert(sendError.response?.data?.message || "잘못된 요청입니다.");
          } else {
            alert("이미지 전송에 실패했습니다. 다시 시도해주세요.");
          }
        }
      } catch (error) {
        console.error("이미지 처리 실패:", error);
        setLoading(false);
        alert("이미지 처리에 실패했습니다. 다시 시도해주세요.");
      }
    };
    
    reader.onerror = () => {
      console.error("이미지 읽기 실패");
      setLoading(false);
      alert("이미지를 읽는데 실패했습니다. 다시 시도해주세요.");
    };
    
    reader.readAsDataURL(file);
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
          onClick={(e) => {
            console.log("전송 버튼 클릭됨", { 
              message: message.trim(), 
              messageLength: message.trim().length,
              uploading,
              disabled: !message.trim() || uploading 
            });
            handleSendText();
          }}
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

