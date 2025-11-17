
import api from "../lib/api"; 

export const cartService = {

  getCartItems: async () => {
    const res = await api.get("/api/cart");
    return res.data;
  },

  addItem: async (productId, count) => {
    const res = await api.post("/api/cart", { productId, count });
    return res.data;
  },


  updateCount: async (productId, count) => {
    const res = await api.patch(`/api/cart/${productId}?count=${count}`);
    return res.data;
  },

  removeItem: async (cartId) => {
    const res = await api.delete(`/api/cart/item/${cartId}`); 
    return res.data;
  },
  

 
  clearCart: async () => {
    const res = await api.delete("/api/cart");
    return res.data;
  },
};
