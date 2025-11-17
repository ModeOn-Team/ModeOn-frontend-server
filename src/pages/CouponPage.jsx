// src/pages/CouponPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import { getUserCoupons, issueCoupon } from "../services/coupon.js";
import { getUserMembership } from "../services/membership.js";

function CouponPage() {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [membershipLevel, setMembershipLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(null);
  const [error, setError] = useState(null);

  // === 등급별 혜택 쿠폰 매핑 ===
  const levelBenefits = {
    WELCOME: ["가입 축하 쿠폰"],
    SILVER: ["생일 쿠폰"],
    GOLD: ["무료배송 쿠폰"],
    VIP: ["월 1회 10% 할인 쿠폰"],
    VVIP: ["월 1회 20% 할인 쿠폰", "월 1회 10% 할인 쿠폰"],
  };

  // === 데이터 로딩 ===
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [membershipData, couponData] = await Promise.all([
          getUserMembership(),
          getUserCoupons(),
        ]);

        setMembershipLevel(membershipData.level || "WELCOME");
        setCoupons(Array.isArray(couponData) ? couponData : []);
      } catch (err) {
        setError("쿠폰 정보를 불러오지 못했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // === 쿠폰 발급 ===
  const handleIssue = async (couponId) => {
    setIssuing(couponId);
    try {
      const result = await issueCoupon(couponId);
      if (result) {
        setCoupons((prev) =>
          prev.map((c) => (c.id === couponId ? { ...c, issued: true } : c))
        );
      }
    } catch (err) {
      alert("쿠폰 발급에 실패했습니다.");
    } finally {
      setIssuing(null);
    }
  };

  // === 혜택 쿠폰 필터링 ===
  const benefitNames = levelBenefits[membershipLevel] || [];
  const benefitCoupons = coupons.filter((c) =>
    benefitNames.some((name) => c.name.includes(name.split(" ")[0]))
  );

  // === 로딩 중 ===
  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 text-center">
          <p className="text-gray-600">쿠폰 정보를 불러오는 중...</p>
        </div>
      </MainLayout>
    );
  }

  // === 에러 ===
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
          나의 쿠폰
        </h1>

        {/* === 등급 전용 혜택 쿠폰 === */}
        {benefitCoupons.length > 0 ? (
          <div className="mb-10 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
            <h2 className="text-lg font-bold text-gray-700 mb-3">
              {membershipLevel} 등급 전용 혜택 쿠폰
            </h2>
            <div className="space-y-3">
              {benefitCoupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`p-4 rounded-lg border ${
                    coupon.issued
                      ? "bg-green-50 border-green-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {coupon.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        유효기간: ~{" "}
                        {new Date(coupon.expiryDate).toLocaleDateString(
                          "ko-KR"
                        )}
                      </p>
                    </div>
                    {coupon.issued ? (
                      <span className="text-green-600 font-medium">
                        발급 완료
                      </span>
                    ) : (
                      <button
                        onClick={() => handleIssue(coupon.id)}
                        disabled={issuing === coupon.id}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50"
                      >
                        {issuing === coupon.id ? "발급 중..." : "발급받기"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : membershipLevel ? (
          <div className="mb-10 p-6 rounded-xl border border-gray-400 text-center">
            <p className="text-blue-700 font-medium">
              {membershipLevel} 등급 전용 혜택 쿠폰이 없습니다.
            </p>
          </div>
        ) : null}

        {/* === 전체 쿠폰 목록 === */}
        {coupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => {
              const isBenefit = benefitCoupons.some((b) => b.id === coupon.id);

              return (
                <div
                  key={coupon.id}
                  className={`p-6 rounded-xl border-2 ${
                    isBenefit
                      ? "border-purple-400 bg-purple-50"
                      : "border-gray-200 bg-white"
                  } shadow-sm hover:shadow-md transition-all`}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {coupon.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {coupon.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">
                      ~{new Date(coupon.expiryDate).toLocaleDateString("ko-KR")}
                    </span>
                    {coupon.issued ? (
                      <span className="text-green-600 font-medium text-sm">
                        사용 가능
                      </span>
                    ) : (
                      <button
                        onClick={() => handleIssue(coupon.id)}
                        disabled={issuing === coupon.id}
                        className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {issuing === coupon.id ? "..." : "발급"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              사용 가능한 쿠폰이 없습니다.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              멤버십 등급을 올리거나, 이벤트에 참여해보세요!
            </p>
          </div>
        )}

        {/* === 안내 문구 === */}
        <div className="mt-12 text-center text-sm text-gray-500">
          * 쿠폰은 발급 후 즉시 사용 가능합니다.
          <br />
          <span className="text-xs">
            마지막 갱신: {new Date().toLocaleString("ko-KR")}
          </span>
        </div>
      </div>
    </MainLayout>
  );
}

export default CouponPage;
