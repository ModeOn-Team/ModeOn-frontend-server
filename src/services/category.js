import api from "./api";

export const CategoryService = {
  getChildCategory: async (parentCategoryId) => {
    const url =
      parentCategoryId != null
        ? `/api/category?parentId=${parentCategoryId}`
        : `/api/category`;

    const res = await api.get(url);
    return res.data;
  },
};
