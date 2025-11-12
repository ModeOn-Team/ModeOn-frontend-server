import api from "./api";

export const wishListService = {
  async toggleWishList(productId) {
    const response = await api.post(`/api/product/${productId}/wishlist`);
    return response.data;
  },
  async getMyWishList(page) {
    const response = await api.get(`/api/product/wishlist?page=${page}`);
    return response.data;
  },
};
