import api from "./api";

const ADMIN_API_URL = import.meta.env.VITE_ADMIN_API_URL || "/api/admin";

export const AdminService = {
  // product
  async ProductCreate(ProductFormData) {
    const response = await api.post(
      ADMIN_API_URL + "/product",
      ProductFormData
    );
    return response.data;
  },

  async ProductImage(ProductFormData) {
    const response = await api.post(
      ADMIN_API_URL + "/product-images",
      ProductFormData,
      {
        headers: {
          "Content-Type": undefined,
        },
      }
    );
    return response.data;
  },

  getAllProducts: async (page = 0, size = 10) => {
    const response = await api.get(ADMIN_API_URL + "/product", {
      params: { page, size },
    });
    return response.data.content;
  },

  async ProductDelete(ProductId) {
    await api.delete(ADMIN_API_URL + `/product/${ProductId}`);
  },

  // productVariant
  async ProductVariantCreate(ProductVariantFormData) {
    const response = await api.post(
      ADMIN_API_URL + `/products/${ProductVariantFormData.productId}/variants`,
      ProductVariantFormData
    );
    return response.data;
  },

  async ProductVariantUpdate(ProductVariantFormData) {
    const response = await api.put(
      ADMIN_API_URL + `/products/variants/${ProductVariantFormData.id}`,
      ProductVariantFormData
    );
    return response.data;
  },

  // category
  getAllCategories: async () => {
    const response = await api.get(ADMIN_API_URL + "/categories");
    return response.data;
  },

  CreateCategory: async (parentId, name) => {
    const response = await api.post(ADMIN_API_URL + "/categories", {
      parentId,
      name,
    });
    return response.data;
  },
};
