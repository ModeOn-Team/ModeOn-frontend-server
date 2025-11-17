import api from "./api";

const API_URL = import.meta.env.VITE_API_URL;
const ADMIN_API = import.meta.env.VITE_ADMIN_API_URL;

export const MembershipService = {
  async getUserMembership() {
    const response = await api.get(`/api/membership/`);
    return response.data;
  },

  async getUserMembership() {
    try {
      const response = await api.get("/api/membership");

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`멤버십 로드 실패: ${response.status} ${errorText}`);
      }

      const data = await response.json();

      return {
        level: data.level || "WELCOME",
        totalSpent: Number(data.totalSpent) || 0,
        lastUpdated: data.lastUpdated || null,
        points: Number(data.points) ?? 0,
        couponCount: Number(data.couponCount) ?? 0,
        reviewCount: Number(data.reviewCount) ?? 0,
      };
    } catch (error) {
      console.error("[Membership API] 실패:", error);

      return {
        level: "WELCOME",
        totalSpent: 0,
        lastUpdated: null,
        points: 0,
        couponCount: 0,
        reviewCount: 0,
      };
    }
  },
};
