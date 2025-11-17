// src/services/coupon.js
export const getUserCoupons = async () => {
  try {
    const response = await fetch("/api/coupon", {
      method: "GET",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("쿠폰 로드 실패");
    return await response.json();
  } catch (error) {
    console.error("[Coupon] 로드 실패:", error);
    return [];
  }
};

export const issueCoupon = async (couponId) => {
  try {
    const response = await fetch("/api/coupon", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ couponId }),
    });
    if (!response.ok) throw new Error("쿠폰 발급 실패");
    return await response.json();
  } catch (error) {
    console.error("[Coupon] 발급 실패:", error);
    return null;
  }
};
