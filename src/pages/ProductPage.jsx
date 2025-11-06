import MainLayout from "../components/layout/MainLayout";
import { useLocation } from "react-router-dom";
import useProductStore from "../store/ProductStore";
import { useState, useEffect, useRef, useCallback } from "react";
import ProductPageList from "../components/product/ProductPageList";

const ProductPage = () => {
  const { ProductSearch, products, loading, last, totalPages } =
    useProductStore();
  const location = useLocation();

  const [gender, setGender] = useState(undefined);
  const [page, setPage] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const genderParam = params.get("gender");
    setGender(genderParam === "null" ? null : genderParam);
    setPage(0);
  }, [location.search]);

  useEffect(() => {
    if (gender === undefined) return;
    ProductSearch({ gender, page }, page > 0);
  }, [gender, page]);

  const observer = useRef();
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !last && page + 1 < totalPages) {
          setPage((prev) => prev + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, last, totalPages, page]
  );

  return (
    <MainLayout>
      <div className="flex py-10 px-40 gap-10 flex-col">
        <h2 className="text-2xl font-bold mb-4">
          {gender ? `${gender} Products` : "All Products"}
        </h2>

        <ProductPageList products={products} />

        {loading ? (
          <div className="text-center py-6 text-gray-500 animate-pulse">
            Loading...
          </div>
        ) : last ? (
          <div className="text-center py-6 text-gray-400 text-sm italic">
            마지막 페이지입니다
          </div>
        ) : (
          <div
            ref={lastElementRef}
            className="text-center py-6 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Scroll to load more
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductPage;
