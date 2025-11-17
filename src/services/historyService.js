import api from "../lib/api";

export const historyService = {
  getHistory: async () => {
    const res = await api.get("/api/history");
    return res.data;
  },

  getHistoryDetail: async (id) => {
    const res = await api.get(`/api/history/${id}`);
    return res.data;
  },

  updateStatus: async (historyId, payload) => {
    const res = await api.patch(`/api/admin/history/${historyId}/status`, payload);
    return res.data;
  },
};
