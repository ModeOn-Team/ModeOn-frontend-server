import api from "../lib/api";

export const reviewService = {
  getReviewsByProduct: async (productId) => {
    const res = await api.get(`/api/reviews/product/${productId}`);
    return res.data;
  },
};
