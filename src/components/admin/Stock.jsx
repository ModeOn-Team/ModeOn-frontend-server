import { useEffect, useState, useRef, useCallback } from "react";
import useAdminStore from "../../store/adminStore";
import useProductStore from "../../store/ProductStore";
import StockList from "./StockList";

const Stock = () => {
  const { ProductVariantUpdate } = useAdminStore();
  const { products, fetchProducts, totalPages } = useProductStore();

  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProducts(page, page > 0).finally(() => setLoading(false));
  }, [page]);

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && page + 1 < totalPages) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, totalPages, page]
  );

  const updateLocalStock = () => {
    fetchProducts(page, page > 0).finally(() => setLoading(false));
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Stock Management</h2>

      <StockList
        products={products}
        ProductVariantUpdate={ProductVariantUpdate}
        onRefresh={() => setPage(0)}
        onLocalUpdateStock={updateLocalStock}
        lastElementRef={lastElementRef}
      />

      {loading && (
        <div className="text-center py-6 text-gray-500 animate-pulse">
          Loading...
        </div>
      )}
      {!loading && page + 1 >= totalPages && products.length > 0 && (
        <div className="text-center py-6 text-gray-400 text-sm italic">
          마지막 페이지입니다
        </div>
      )}
    </div>
  );
};

export default Stock;
