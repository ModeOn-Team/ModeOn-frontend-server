import api from "./api";

export const MembershipService = {
  async getUserMembership() {
    try {
      const response = await api.get("/api/membership");

      const data = response.data;

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
