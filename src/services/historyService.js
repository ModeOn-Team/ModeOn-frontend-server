import api from "../lib/api";

export const historyService = {
  getHistory: async () => {
    const res = await api.get("/api/history");
    return res.data;
  },
};

