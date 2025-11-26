import api from "../lib/api";

export const adminRequestService = {
  // 요청 상세 조회
  async getDetail(id) {
    const res = await api.get(`/api/admin/history/${id}`);
    return res.data;
  },

  // 승인
  async approve(id, type, reason) {
    return api.patch(`/api/admin/history/${id}/${type}/approve`, { reason });
  },

  // 거절
  async reject(id, type, reason) {
    return api.patch(`/api/admin/history/${id}/${type}/reject`, { reason });
  },
};
 
