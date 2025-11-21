import { create } from "zustand";
import { AdminService } from "../services/admin";
import { asyncHandler } from "../utils/asyncHandler";
import { CategoryService } from "../services/category";

const useCategoryStore = create((set) => ({
  products: [],
  categories: [],
  categoryByDepth: {},
  loading: false,
  error: null,

  CreateCategory: async (parentId, name) =>
    asyncHandler(set, async () => {
      const newCategory = await AdminService.CreateCategory(parentId, name);
      set((state) => {
        const key = parentId ?? "root";
        const prev = state.categoryByDepth[key] || [];
        return {
          categoryByDepth: {
            ...state.categoryByDepth,
            [key]: [...prev, newCategory],
          },
        };
      });
    }),

  getChildCategory: async (parentId = null) => {
    const children = await CategoryService.getChildCategory(parentId);
    set((state) => ({
      categoryByDepth: {
        ...state.categoryByDepth,
        [parentId ?? "root"]: children,
      },
    }));
  },
}));

export default useCategoryStore;
