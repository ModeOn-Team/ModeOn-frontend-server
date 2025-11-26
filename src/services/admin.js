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

  async ProductDelete(ProductId) {
    await api.delete(ADMIN_API_URL + `/product/${ProductId}`);
  },

  // productVariant
  async ProductVariantCreate(productId, ProductVariantFormData) {
    const response = await api.post(
      ADMIN_API_URL + `/products/${productId}/variants`,
      ProductVariantFormData
    );
    return response.data;
  },

  async ProductVariantCreateToNaver(productId, ProductVariantFormData) {
    const response = await api.post(
      `/api/product/variant/${productId}/naver`,
      ProductVariantFormData
    );
    return response.data;
  },

  async ProductVariantUpdate(ProductVariantId, ProductVariantFormData) {
    const response = await api.put(
      ADMIN_API_URL + `/products/variants/${ProductVariantId}`,
      ProductVariantFormData
    );
    return response.data;
  },

  // category
  CreateCategory: async (parentId, name) => {
    const response = await api.post(ADMIN_API_URL + "/categories", {
      parentId,
      name,
    });
    return response.data;
  },

};
