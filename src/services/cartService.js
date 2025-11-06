
import api from "../lib/api"; 

export const cartService = {

  getCartItems: async () => {
    const res = await api.get("/cart");
    return res.data;
  },

  addItem: async (productId, count) => {
    const res = await api.post("/cart", { productId, count });
    return res.data;
  },


  updateCount: async (productId, count) => {
    const res = await api.patch(`/cart/${productId}?count=${count}`);
    return res.data;
  },

  removeItem: async (productId) => {
    const res = await api.delete(`/cart/${productId}`);
    return res.data;
  },

 
  clearCart: async () => {
    const res = await api.delete("/cart");
    return res.data;
  },
};
