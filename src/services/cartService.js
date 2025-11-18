
import api from "../lib/api"; 

export const cartService = {

  getCartItems: async () => {
    const res = await api.get("/api/cart");
    return res.data;
  },

  addItem: async ({ productId, count, size, color }) => {
    const res = await api.post("/api/cart", { productId, count, size, color });
    return res.data;
  },
  


  updateCount: async (cartId, count) => {
    const res = await api.patch(`/api/cart/item/${cartId}?count=${count}`);
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
