import { create } from "zustand";
import { AdminService } from "../services/admin";

const useAdminStore = create((set) => ({
  products: [],
  categories: [],
  loading: false,
  error: null,

  // product
  ProductCreate: async (ProductFormData) => {
    set({ loading: true, error: null });
    try {
      const data = await AdminService.ProductCreate(ProductFormData);
      set({
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "ProductCreate failed",
      });
      throw err;
    }
  },

  ProductImage: async (ProductFormData) => {
    set({ loading: true, error: null });
    try {
      const uploadedProduct = await AdminService.ProductImage(ProductFormData);
      set((state) => ({
        products: [uploadedProduct, ...state.products],
        loading: false,
      }));
      set({
        loading: false,
      });
      return uploadedProduct;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "ProductCreate failed",
      });
      throw err;
    }
  },

  // productVariant
  ProductVariantCreate: async (productId, ProductVariantFormData) => {
    set({ loading: true, error: null });
    try {
      const data = await AdminService.ProductVariantCreate(
        productId,
        ProductVariantFormData
      );
      set({
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "ProductVariantCreate failed",
      });
      throw err;
    }
  },

  ProductVariantUpdate: async (ProductVariantId, ProductVariantFormData) => {
    set({ loading: true, error: null });
    try {
      const data = await AdminService.ProductVariantUpdate(
        ProductVariantId,
        ProductVariantFormData
      );
      set({
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "ProductVariantUpdate failed",
      });
      throw err;
    }
  },

  ProductDelete: async (ProductId) => {
    set({ loading: true, error: null });
    try {
      const data = await AdminService.ProductDelete(ProductId);
      set({
        loading: false,
      });
      return data;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "ProductDelete failed",
      });
      throw err;
    }
  },

  // category
  CreateCategory: async (parentId, name) => {
    set({ loading: true, error: null });
    try {
      const newCategory = await AdminService.CreateCategory(parentId, name);
      set((state) => ({
        categories: [newCategory, ...state.categories],
        loading: false,
      }));
    } catch (err) {
      set({
        error: err.response?.data.message || "Failed to create categories",
        loading: false,
      });
      throw err;
    }
  },
}));

export default useAdminStore;
