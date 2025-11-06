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
    const res =await api.get(`/api/product/detail/${productId}`);
    return res.data;
  },

  async ProductSearch(ProductSearchForm) {
    const {
      gender,
      categoryName,
      size,
      color,
      word,
      page,
      size: pageSize,
    } = ProductSearchForm;

    console.log(gender);
    const query = new URLSearchParams();
    if (gender) query.append("gender", gender);
    if (categoryName) query.append("categoryName", categoryName);
    if (size) query.append("size", size);
    if (color) query.append("color", color);
    if (word) query.append("word", word);
    if (page !== undefined) query.append("page", page);
    if (pageSize !== undefined) query.append("size", pageSize);

    const response = await api.get(`/api/product/search?${query.toString()}`);
    return response.data;
  },
};
