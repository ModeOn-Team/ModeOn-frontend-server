import React from "react";
// MembershipInfo 컴포넌트를 가져와 사용합니다.
import MembershipInfo from "../components/ui/MembershipInfo.jsx";
import { useNavigate } from "react-router-dom";

function MembershipPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center pt-20 pb-10 min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-10 text-gray-800">
        나의 멤버십 등급 및 혜택 상세
      </h1>

      <button
        onClick={() => navigate("/mypage")}
        className="absolute top-20 left-10 text-gray-600 hover:text-gray-900"
      >
        ← 마이페이지로 돌아가기
      </button>

      {/* 🚨 [핵심] API 통신 컴포넌트 렌더링 */}
      <MembershipInfo />

      {/* 추후 멤버십 기준 및 상세 혜택 설명을 여기에 추가합니다. */}
      <div className="mt-10 p-6 bg-white border rounded-lg shadow-lg w-full max-w-4xl">
        <h2 className="text-xl font-semibold mb-4">등급 승격 기준</h2>
        <p>GOLD 등급: 누적 구매액 30만원 이상</p>
        <p>VIP 등급: 누적 구매액 70만원 이상</p>
        {/* ... 기타 상세 기준 ... */}
      </div>
    </div>
  );
}

export default MembershipPage;
