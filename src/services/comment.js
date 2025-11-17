import api from "./api";

export const CommentService = {
  async getAllComment(productId) {
    const response = await api.get(`api/comments/product/${productId}`);

    return response.data;
  },

  async addComment(id, content) {
    const response = await api.post(`api/comments/product/${id}`, content);
    
    return response.data;
  },
};
