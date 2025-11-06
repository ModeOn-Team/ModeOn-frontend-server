// Typing Indicator 컴포넌트
// 상대방이 입력 중일 때 표시되는 애니메이션
const TypingIndicator = () => {
  return (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg flex items-center gap-1">
        <span className="text-sm text-gray-600">입력 중</span>
        <div className="flex gap-1">
          <span
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></span>
          <span
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></span>
          <span
            className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></span>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

