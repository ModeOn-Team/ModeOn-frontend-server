import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { MembershipService } from "../services/membership.js";
import MainLayout from "../components/layout/MainLayout.jsx";

function MembershipDetailPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 미리보기 모드 감지
  const previewLevel = searchParams.get("preview");
  const isPreview = !!previewLevel;

  // API 호출
  useEffect(() => {
    const fetchMembership = async () => {
      try {
        const data = await MembershipService.getUserMembership();
        setUserInfo(data);
      } catch (err) {
        console.error("멤버십 정보 로드 실패:", err);
        setError(
          "멤버십 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchMembership();
  }, []);

  // 로딩 상태
  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg text-gray-600">
            멤버십 정보를 불러오는 중...
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <p className="font-semibold text-red-600">오류 발생</p>
          <p className="text-sm text-gray-600 mt-2">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            새로고침
          </button>
        </div>
      </MainLayout>
    );
  }

  if (!userInfo) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-600">사용자 정보를 찾을 수 없습니다.</div>
        </div>
      </MainLayout>
    );
  }

  // ==== 등급 계산 로직 (프론트에서 직접 계산) ====
  const levelRules = [
    { name: "WELCOME", minAmount: 0 },
    { name: "SILVER", minAmount: 100000 },
    { name: "GOLD", minAmount: 300000 },
    { name: "VIP", minAmount: 500000 },
    { name: "VVIP", minAmount: 1000000 },
  ];

  let calculatedLevel = "WELCOME";
  for (let i = 0; i < levelRules.length; i++) {
    if (userInfo.totalSpent >= levelRules[i].minAmount) {
      calculatedLevel = levelRules[i].name;
    }
  }

  const effectiveLevel = isPreview ? previewLevel : calculatedLevel;

  // 안전한 데이터 처리
  const username = userInfo.username || "사용자";
  const point = userInfo.point ?? 0;

  // 등급 색상
  const levelColors = {
    WELCOME: "#94a3b8",
    SILVER: "#94a3b8",
    GOLD: "#fbbf24",
    VIP: "#8b5cf6",
    VVIP: "#ec4899",
  };

  const widgets = [
    {
      label: "현재 등급",
      value: effectiveLevel,
      color: levelColors[effectiveLevel] || "#4a90e2",
      onClick: () => navigate("/mypage/membership"),
    },
    {
      label: "포인트",
      value: `${point.toLocaleString()} P`,
      color: "#ff6600",
      onClick: () => navigate("/mypage/point"),
    },
    {
      label: "쿠폰",
      value: `${userInfo.couponCount || 0}개`,
      color: "#10b981",
      onClick: () => navigate("/mypage/coupon"),
    },
    {
      label: "리뷰",
      value: `${userInfo.reviewCount || 0}개`,
      color: "#6366f1",
      onClick: () => navigate("/mypage/reviews"),
    },
  ];

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        {/* 뒤로가기 */}
        <button
          onClick={() => (isPreview ? navigate(-1) : navigate("/mypage"))}
          className="mb-6 text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1 transition"
        >
          {isPreview ? "뒤로 가기" : "마이페이지로 돌아가기"}
        </button>

        <h1 className="text-3xl font-bold mb-8 text-center md:text-left text-gray-800">
          {isPreview
            ? `${effectiveLevel} 등급 미리보기`
            : `${username} 님의 멤버십 상세`}
        </h1>

        {/* 위젯 섹션 */}
        <section className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {widgets.map((widget, index) => (
              <button
                key={index}
                onClick={widget.onClick}
                className="text-center p-4 border rounded-lg hover:bg-gray-50 hover:shadow-md transition-all flex flex-col justify-center h-24"
              >
                <div className="text-xs font-medium text-gray-500 mb-1">
                  {widget.label}
                </div>
                <div
                  className="text-xl font-bold"
                  style={{ color: widget.color }}
                >
                  {widget.value}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 혜택 상세 */}
        <section className="p-6 bg-white border rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            {effectiveLevel} 등급 혜택 상세
            {isPreview && (
              <span className="text-sm font-normal text-blue-600">
                (미리보기)
              </span>
            )}
          </h2>

          <ul className="list-disc list-inside space-y-2 ml-4 text-gray-700 text-sm leading-relaxed">
            {effectiveLevel === "WELCOME" && (
              <li>가입 축하 쿠폰, 첫 구매 5% 할인 (최초 1회)</li>
            )}
            {["SILVER", "GOLD", "VIP", "VVIP"].includes(effectiveLevel) && (
              <li>생일 쿠폰 (연 1회 지급)</li>
            )}
            {["GOLD", "VIP", "VVIP"].includes(effectiveLevel) && (
              <li>전 상품 5% 적립, 무료배송 쿠폰 (월간 지급)</li>
            )}
            {["VIP", "VVIP"].includes(effectiveLevel) && (
              <li>월 1회 10% 할인 쿠폰</li>
            )}
            {effectiveLevel === "VVIP" && (
              <li>월 1회 20% 할인 쿠폰 (최고 등급 전용)</li>
            )}
          </ul>

          {!isPreview && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
              <strong>{effectiveLevel}</strong> 등급입니다.{" "}
              <button
                onClick={() => navigate("/mypage/membership/levels")}
                className="underline hover:no-underline font-medium"
              >
                모든 등급 혜택 비교하기
              </button>
            </div>
          )}
        </section>

        <div className="mt-10 text-sm text-gray-500 text-center">
          * 등급 기준: 최근 12개월 누적 구매액 기준
          <br />
          <span className="text-xs">
            마지막 갱신: {new Date().toLocaleString("ko-KR")}
          </span>
        </div>
      </div>
    </MainLayout>
  );
}

export default MembershipDetailPage;
