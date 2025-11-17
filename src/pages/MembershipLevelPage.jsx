import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import { getUserMembership } from "../services/membership.js";

const levels = [
  {
    name: "WELCOME",
    color: "#94a3b8",
    minAmount: 0,
    benefits: ["가입 축하 쿠폰", "첫 구매 5% 할인 (최초 1회)"],
  },
  {
    name: "SILVER",
    color: "#94a3b8",
    minAmount: 100000,
    benefits: [
      "생일 쿠폰 (연 1회)",
      "전 상품 2% 적립",
      "가입 축하 쿠폰",
      "첫 구매 5% 할인",
    ],
  },
  {
    name: "GOLD",
    color: "#fbbf24",
    minAmount: 300000,
    benefits: [
      "전 상품 5% 적립",
      "무료배송 쿠폰 (월간)",
      "생일 쿠폰 (연 1회)",
      "가입 축하 쿠폰",
    ],
  },
  {
    name: "VIP",
    color: "#8b5cf6",
    minAmount: 500000,
    benefits: [
      "월 1회 10% 할인 쿠폰",
      "전 상품 7% 적립",
      "무료배송 쿠폰 (월간)",
      "생일 쿠폰 (연 1회)",
    ],
  },
  {
    name: "VVIP",
    color: "#ec4899",
    minAmount: 1000000,
    benefits: [
      "월 1회 20% 할인 쿠폰 (최고 등급 전용)",
      "월 1회 10% 할인 쿠폰",
      "전 상품 10% 적립",
      "무료배송 쿠폰 (월간)",
      "생일 쿠폰 (연 1회)",
    ],
  },
];

function MembershipLevelPage() {
  const navigate = useNavigate();

  const [userData, setUserData] = useState({
    totalSpent: 0,
    lastUpdated: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getUserMembership();
        setUserData(data);
        setError(null);
      } catch (err) {
        setError("멤버십 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // === 자동 등급 계산 ===
  let currentIndex = 0;
  for (let i = 0; i < levels.length; i++) {
    if (userData.totalSpent >= levels[i].minAmount) {
      currentIndex = i;
    } else {
      break;
    }
  }
  const userLevel = levels[currentIndex].name;

  // === 다음 등급 ===
  const nextLevel =
    currentIndex < levels.length - 1 ? levels[currentIndex + 1] : null;

  // === 진행률 계산 ===
  const currentMin = currentIndex > 0 ? levels[currentIndex - 1].minAmount : 0;
  const nextMin = nextLevel ? nextLevel.minAmount : userData.totalSpent;
  const progress = nextLevel
    ? ((userData.totalSpent - currentMin) / (nextMin - currentMin)) * 100
    : 100;

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 text-center">
          <p className="text-gray-600">멤버십 정보를 불러오는 중...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
          모든 멤버십 등급 혜택 비교
        </h1>

        {/* 진행률 바 */}
        {nextLevel && (
          <div className="mb-10 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-800">
                현재: <span className="text-blue-600">{userLevel}</span>
              </span>
              <span className="text-sm text-gray-600">
                {nextLevel.name}까지{" "}
                <strong className="text-indigo-600">
                  {(nextLevel.minAmount - userData.totalSpent).toLocaleString()}
                  원
                </strong>{" "}
                남음
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
            <div className="mt-2 text-right text-sm text-gray-600">
              {progress.toFixed(0)}% 달성
            </div>
          </div>
        )}

        {/* VVIP 달성 */}
        {!nextLevel && (
          <div className="mb-10 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 text-center">
            <p className="text-lg font-bold text-purple-700">
              축하합니다! <span className="text-pink-600">{userLevel}</span>{" "}
              등급입니다.
            </p>
            <p className="text-sm text-purple-600 mt-2">
              최고 등급을 달성하셨습니다!
            </p>
          </div>
        )}

        {/* 등급 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {levels.map((level) => {
            const isCurrent = level.name === userLevel;
            const isAchieved = userData.totalSpent >= level.minAmount;

            return (
              <div
                key={level.name}
                className={`
                  bg-white border-2 rounded-xl shadow-md p-6 hover:shadow-lg
                  transition-all flex flex-col
                  ${
                    isCurrent
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200"
                  }
                `}
              >
                {/* 등급 이름 + 현재 라벨 */}
                <div
                  className="text-2xl font-bold mb-3 text-center"
                  style={{ color: level.color }}
                >
                  {level.name}
                  {isCurrent && (
                    <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      현재
                    </span>
                  )}
                  {isAchieved && !isCurrent && (
                    <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                      달성
                    </span>
                  )}
                </div>

                {/* 누적 금액 기준 */}
                <div className="text-center mb-4 text-sm font-semibold text-gray-700">
                  {level.minAmount.toLocaleString()}원 이상
                </div>

                {/* 혜택 리스트 */}
                <ul className="space-y-2 text-sm text-gray-700">
                  {level.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-4 h-4 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#3B82F6"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 13l4 4l9 -12" />
                      </svg>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* 등급 기준 안내 */}
        <div className="mt-12 text-center text-sm text-gray-500">
          * 등급 기준: 최근 12개월 누적 구매액 기준
          <br />
          <span className="text-xs">
            마지막 갱신:{" "}
            {userData.lastUpdated
              ? new Date(userData.lastUpdated).toLocaleString("ko-KR")
              : "N/A"}
          </span>
        </div>
      </div>
    </MainLayout>
  );
}

export default MembershipLevelPage;
