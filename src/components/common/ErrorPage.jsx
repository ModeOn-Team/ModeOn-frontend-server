import { useNavigate } from "react-router-dom";

const ErrorPage = ({ 
  title = "오류가 발생했습니다", 
  message = "요청하신 페이지를 찾을 수 없거나 접근 권한이 없습니다.",
  statusCode = null,
  showBackButton = true 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8">
        {statusCode && (
          <h1 className="text-6xl font-bold text-gray-300 mb-4">{statusCode}</h1>
        )}
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        {showBackButton && (
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              이전 페이지
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              홈으로 이동
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ErrorPage;

