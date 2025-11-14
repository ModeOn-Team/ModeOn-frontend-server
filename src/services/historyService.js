import api from "../lib/api";

export const historyService = {

    // 주문내역
  getHistory: async () => {
    const res = await api.get("/api/history");
    return res.data;
  },
// 주문내역 상세조회
  getHistoryDetail: async (id) => {
    const res = await api.get(`/api/history/${id}`);
    return res.data;
  },

  //배송상태 변경 
  updateStatus: async (historyId, payload) => {
    const res = await api.patch(`/api/admin/history/${historyId}/status`, payload);
    return res.data;
}

};