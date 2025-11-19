// src/pages/CouponPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import { getUserCoupons, issueCoupon } from "../services/coupon.js";
import { MembershipService } from "../services/membership.js";

function CouponPage() {
  const navigate = useNavigate();

  const [coupons, setCoupons] = useState([]);
  const [membershipLevel, setMembershipLevel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(null);
  const [error, setError] = useState(null);

  // 등급별 쿠폰 이름 매칭 규칙 (백엔드 쿠폰 이름 기반)
  const levelBenefits = {
    WELCOME: ["가입 축하"],
    SILVER: ["생일"],
    GOLD: ["무료배송"],
    VIP: ["VIP 월 10%"],
    VVIP: ["VVIP 월 20%", "VIP 월 10%"],
  };

  // 데이터 로드
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [membershipData, couponData] = await Promise.all([
          MembershipService.getUserMembership(),
          getUserCoupons(),
        ]);

        setMembershipLevel(membershipData.level || "WELCOME");
        setCoupons(Array.isArray(couponData) ? couponData : []);
      } catch (err) {
        console.error(err);
        setError("쿠폰 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // 쿠폰 발급
  const handleIssue = async (couponId) => {
    setIssuing(couponId);
    try {
      const result = await issueCoupon(couponId);
      if (result) {
        // 발급 처리됨 → UI 업데이트
        setCoupons((prev) =>
          prev.map((c) =>
            c.couponId === couponId ? { ...c, isUsed: false } : c
          )
        );
      }
    } catch (err) {
      alert("쿠폰 발급에 실패했습니다.");
    } finally {
      setIssuing(null);
    }
  };

  // 등급 전용 혜택 필터
  const benefitKeywords = levelBenefits[membershipLevel] || [];
  const benefitCoupons = coupons.filter((c) =>
    benefitKeywords.some((key) => c.name.includes(key))
  );

  /* ---- UI 렌더링 ---- */

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto py-8 text-center">
          쿠폰 정보를 불러오는 중...
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto py-8 text-center text-red-600">
          {error}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900 font-semibold"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8">나의 쿠폰</h1>

        {/* 등급 전용 혜택 쿠폰 */}
        {benefitCoupons.length > 0 ? (
          <div className="mb-10 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border rounded-xl">
            <h2 className="text-lg font-bold mb-4">
              {membershipLevel} 등급 전용 혜택 쿠폰
            </h2>

            <div className="space-y-4">
              {benefitCoupons.map((coupon) => (
                <div
                  key={coupon.couponId}
                  className="p-4 bg-white border rounded-lg flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold">{coupon.name}</p>
                    <p className="text-sm text-gray-600">
                      유효기간: ~{" "}
                      {new Date(coupon.expiresAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>

                  {/* 발급 여부 */}
                  {coupon.isUsed ? (
                    <span className="text-green-600 font-medium">
                      사용 완료
                    </span>
                  ) : (
                    <button
                      onClick={() => handleIssue(coupon.couponId)}
                      disabled={issuing === coupon.couponId}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {issuing === coupon.couponId ? "발급중..." : "발급받기"}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6 border rounded-lg text-center mb-10">
            {membershipLevel} 등급 전용 혜택 쿠폰이 없습니다.
          </div>
        )}

        {/* 전체 쿠폰 목록 */}
        {coupons.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coupons.map((coupon) => (
              <div
                key={coupon.couponId}
                className="p-6 bg-white border rounded-xl shadow-sm"
              >
                <h3 className="font-bold text-lg mb-2">{coupon.name}</h3>

                <p className="text-sm text-gray-500 mb-3">
                  ~ {new Date(coupon.expiresAt).toLocaleDateString("ko-KR")}
                </p>

                <div className="flex justify-between items-center">
                  {coupon.isUsed ? (
                    <span className="text-sm text-green-600">사용 완료</span>
                  ) : (
                    <button
                      onClick={() => handleIssue(coupon.couponId)}
                      disabled={issuing === coupon.couponId}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                    >
                      {issuing === coupon.couponId ? "..." : "발급"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              사용 가능한 쿠폰이 없습니다.
            </p>
            <p className="text-xs text-gray-400 mt-2">
              멤버십 등급을 올리거나 이벤트에 참여해보세요!
            </p>
          </div>
        )}

        <div className="mt-12 text-center text-sm text-gray-500">
          * 쿠폰은 발급 후 즉시 사용 가능합니다.
          <br />
          마지막 갱신: {new Date().toLocaleString("ko-KR")}
        </div>
      </div>
    </MainLayout>
  );
}

export default CouponPage;
