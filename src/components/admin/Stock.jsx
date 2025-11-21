import { useEffect, useState } from "react";
import useAdminStore from "../../store/adminStore";
import useProductStore from "../../store/ProductStore";
import StockList from "./StockList";

const Stock = () => {
  const { ProductVariantUpdate } = useAdminStore();
  const { products, fetchProducts, totalPages } = useProductStore();

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadPage = (pageNumber) => {
    setLoading(true);
    fetchProducts(pageNumber)
      .finally(() => setLoading(false))
      .then(() => setPage(pageNumber));
  };

  useEffect(() => {
    loadPage(0);
  }, []);

  const handlePrev = () => {
    if (page > 0) loadPage(page - 1);
  };

  const handleNext = () => {
    if (page + 1 < totalPages) loadPage(page + 1);
  };

  const handlePageClick = (pageNumber) => {
    loadPage(pageNumber);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Stock Management</h2>

      <StockList
        products={products}
        ProductVariantUpdate={ProductVariantUpdate}
        onRefresh={() => loadPage(page)}
      />

      {/* 페이지네이션 */}
      <div className="flex justify-center items-center gap-2 mt-6">
        <button
          onClick={handlePrev}
          disabled={page === 0}
          className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            onClick={() => handlePageClick(idx)}
            className={`px-3 py-1 rounded border ${
              idx === page
                ? "bg-black text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={handleNext}
          disabled={page + 1 >= totalPages}
          className="px-3 py-1 rounded border bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {loading && (
        <div className="text-center py-6 text-gray-500 animate-pulse">
          Loading...
        </div>
      )}
    </div>
  );
};

export default Stock;
