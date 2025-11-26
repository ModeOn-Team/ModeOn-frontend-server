import api from "./api";

export const getUserCoupons = async () => {
  try {
    const response = await api.get("/api/coupon");
    return response.data;
  } catch (error) {
    console.error("[Coupon] 로드 실패:", error);
    return [];
  }
};

export const issueCoupon = async (couponId) => {
  try {
    const response = await api.post("/api/coupon", { couponId });
    return response.data;
  } catch (error) {
    console.error("[Coupon] 발급 실패:", error);
    return null;
  }
};
