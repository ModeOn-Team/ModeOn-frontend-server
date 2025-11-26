import api from "./api";

export const ProductService = {
  getAllProducts: async (page = 0, size = 5) => {
    const response = await api.get("/api/product/list", {
      params: { page, size },
    });
    return response.data;
  },

  getAllCategories: async () => {
    const response = await api.get("/api/product/categories");
    return response.data;
  },

  getProductById: async (productId) => {
    const response = await api.get(`/api/product/detail/${productId}`);
    return response.data;
  },

  async ProductSearch(ProductSearchForm) {
    const { gender, categoryName, size, color, word, page, pageSize } =
      ProductSearchForm;

    const query = new URLSearchParams();
    if (gender) query.append("gender", gender);
    if (categoryName) query.append("categoryName", categoryName);
    if (size) query.append("size", size);
    if (color) query.append("color", color);
    if (word) query.append("word", word);
    if (page !== undefined) query.append("page", page);
    if (pageSize !== undefined) query.append("pageSize", pageSize);

    const response = await api.get(`/api/product/search?${query.toString()}`);
    return response.data;
  },

  ProductUploadToNaver: async (productId, responseImageUrl) => {
    const response = await api.post(
      `/api/product/upload-naver/${productId}`,
      responseImageUrl
    );
    return response.data;
  },

  ProductImageUploadToNaver: async (ProductFormData) => {
    const response = await api.post(
      `/api/product/image/upload-naver`,
      ProductFormData,
      {
        headers: {
          "Content-Type": undefined,
        },
      }
    );
    return response.data;
  },

  ProductVariantFetch: async (categoryId) => {
    const response = await api.get(
      `/api/product/variant/load-naver/${categoryId}`,
    );
    console.log("ProductVariantFetch response:", response);
    return response.data;
  },
};
