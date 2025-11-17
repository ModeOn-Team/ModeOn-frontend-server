import { create } from "zustand";
import { wishListService } from "../services/wishList";

const useWishListStore = create((set) => ({
  myWishList: [],
  loading: false,
  last: false,
  error: null,

  fetchMyWishList: async (page = 0) => {
    set({ loading: true, error: null });
    try {
      const data = await wishListService.getMyWishList(page);
      set((state) => ({
        myWishList: data.content,
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data.message || "Failed to fetch myWishList",
        loading: false,
      });
      throw err;
    }
  },

}));

export default useWishListStore;
