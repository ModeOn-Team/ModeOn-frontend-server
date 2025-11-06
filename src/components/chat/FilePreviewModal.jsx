import { useState } from "react";
import { IoClose } from "react-icons/io5";

// 파일/이미지 미리보기 모달
// 전송 전 확인 및 캡션 추가 가능
const FilePreviewModal = ({ file, preview, type, onClose, onSend }) => {
  const [caption, setCaption] = useState("");

  const handleSend = () => {
    onSend(caption);
    setCaption("");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-lg">
            {type === "image" ? "이미지 전송" : "파일 전송"}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        <div className="p-4">
          {type === "image" && preview && (
            <div className="mb-4">
              <img
                src={preview}
                alt="미리보기"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}

          {type === "file" && (
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="font-medium">{file.name}</p>
              <p className="text-sm text-gray-500">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="캡션을 입력하세요 (선택사항)..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows="3"
          />
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSend}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilePreviewModal;

