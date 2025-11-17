import { useState, useCallback } from "react";
import {
  sendImageMessage,
  sendFileMessage,
} from "../services/chatApi";



const useFileUpload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);

  // 이미지 업로드
  const uploadImage = useCallback(async (roomId, file) => {
    if (!file || !file.type.startsWith("image/")) {
      throw new Error("이미지 파일만 업로드 가능합니다.");
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("roomId", roomId);
      formData.append("file", file);

      // Axios onUploadProgress는 현재 axios 설정에 따라 작동
      // 실제 진행률은 백엔드에서 제공하는 경우에만 표시 가능
      const response = await sendImageMessage(formData);

      setUploadProgress(100);
      setUploading(false);
      return response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "이미지 업로드에 실패했습니다.";
      setError(errorMessage);
      setUploading(false);
      throw err;
    }
  }, []);

  // 파일 업로드
  const uploadFile = useCallback(async (roomId, file) => {
    if (!file) {
      throw new Error("파일을 선택해주세요.");
    }

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("roomId", roomId);
      formData.append("file", file);
      formData.append("fileName", file.name);

      const response = await sendFileMessage(formData);

      setUploadProgress(100);
      setUploading(false);
      return response;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "파일 업로드에 실패했습니다.";
      setError(errorMessage);
      setUploading(false);
      throw err;
    }
  }, []);

  // 이미지 파일 미리보기 생성
  const createImagePreview = useCallback((file) => {
    return new Promise((resolve, reject) => {
      if (!file.type.startsWith("image/")) {
        reject(new Error("이미지 파일이 아닙니다."));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }, []);

  // 파일 크기 포맷팅
  const formatFileSize = useCallback((bytes) => {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  }, []);

  return {
    uploading,
    uploadProgress,
    error,
    uploadImage,
    uploadFile,
    createImagePreview,
    formatFileSize,
  };
};

export default useFileUpload;

