export const asyncHandler = async (set, callback) => {
  set({ loading: true, error: null });

  try {
    const result = await callback();  
    return result;                   
  } catch (err) {
    set({
      error: err.message || "Request failed",
    });
    throw err;
  } finally {
    set({ loading: false });
  }
};
