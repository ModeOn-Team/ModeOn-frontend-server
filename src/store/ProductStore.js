import { create } from "zustand";
import { ProductService } from "../services/product";
import { asyncHandler } from "../utils/asyncHandler";

const useProductStore = create((set) => ({
  selectedProduct: null,
  search: [],
  products: [],
  categories: [],
  variants: [],
  totalPages: 0,
  loading: false,
  last: false,
  error: null,

  // product
  fetchProducts: async (page = 0, append = false) => {
    set({ loading: true, error: null });
    try {
      const data = await ProductService.getAllProducts(page);

      set((state) => ({
        products: append ? [...state.products, ...data.content] : data.content,
        loading: false,
        totalPages: data.totalPages,
        last: data.last,
      }));
    } catch (err) {
      set({
        error: err.response?.data.message || "Failed to fetch products",
        loading: false,
      });
      throw err;
    }
  },

  fetchProductById: async (productId) => {
    set({ loading: true, error: null });
    try {
      const data = await ProductService.getProductById(productId);
      set({ selectedProduct: data, loading: false });
    } catch (err) {
      set({
        error: err.response?.data?.message || "Failed to fetch product detail",
        loading: false,
      });
      throw err;
    }
  },

  ProductSearch: async (ProductSearchForm, append = false) => {
    if (!append) set({ products: [] });
    set({ loading: true, error: null });
    try {
      const data = await ProductService.ProductSearch(ProductSearchForm);
      set((state) => ({
        products: append ? [...state.products, ...data.content] : data.content,
        loading: false,
        totalPages: data.totalPages,
        last: data.last,
      }));
      return data.content;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "ProductSearch failed",
      });
      throw err;
    }
  },

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const content = await ProductService.getAllCategories();
      set({
        categories: content,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.response?.data.message || "Failed to fetch categories",
        loading: false,
      });
      throw err;
    }
  },

  ProductUploadToNaver: async (productId, responseImageUrl) =>
    asyncHandler(set, async () => {
      const ProductUpload = await ProductService.ProductUploadToNaver(
        productId,
        responseImageUrl
      );
    }),

  ProductImageUploadToNaver: async (ProductFormData) =>
    asyncHandler(set, async () => {
      const uploadImages = await ProductService.ProductImageUploadToNaver(
        ProductFormData
      );
      return uploadImages;
    }),

  ProductVariantFetch: async (categoryId) =>
    asyncHandler(set, async () => {
      const response = await ProductService.ProductVariantFetch(
        categoryId
      );
      return response;
    }),
}));

export default useProductStore;
