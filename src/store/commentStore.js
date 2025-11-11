import { create } from "zustand";
import { CommentService } from "../services/comment";

const useCommentStore = create((set) => ({
  comments: [],
  totalPages: 0,
  loading: false,
  last: false,
  error: null,

  getAllComment: async (poductId) => {
    set({ loading: true, error: null });
    try {
      const data = await CommentService.getAllComment(poductId);
      set({
        comments: data.content,
        loading: false,
        totalPages: data.totalPages,
        last: data.last,
      });
      return data.content;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "getAllComment failed",
      });
      throw err;
    }
  },

  addComment: async (id, content) => {
    set({ loading: true, error: null });
    try {
      const data = await CommentService.addComment(id, content);
      set((state) => ({
        comments: [...state.comments, data],
        loading: false,
      }));
      return data.content;
    } catch (err) {
      set({
        loading: false,
        error: err.response?.data?.message || "getAllComment failed",
      });
      throw err;
    }
  },
}));

export default useCommentStore;
