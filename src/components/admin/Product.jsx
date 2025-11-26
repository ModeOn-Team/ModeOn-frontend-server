import { useEffect } from "react";
import useAdminStore from "../../store/adminStore";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";
import useProductStore from "../../store/ProductStore";

const Product = ({ setActiveTab }) => {
  const { ProductDelete } = useAdminStore();
  const {
    categories,
    products,
    fetchCategories,
    fetchProducts,
    page,
    totalPages,
  } = useProductStore();

  useEffect(() => {
    fetchProducts(0, false);
    fetchCategories();
  }, []);

  const handlePageChange = (newPage) => {
    fetchProducts(newPage, false);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>

      <ProductSearch categories={categories} />

      <div className="flex justify-end">
        <button
          onClick={() =>
            setActiveTab("product new")
          }
          className="bg-black hover:bg-red-400 text-white px-4 py-2 rounded"
        >
          Add Product
        </button>
      </div>

      <ProductList
        products={products}
        ProductDelete={ProductDelete}
        onRefresh={() => fetchProducts(page, false)}
      />

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, idx) => (
            <button
              key={idx}
              onClick={() => handlePageChange(idx)}
              className={`px-3 py-1 rounded-md border ${
                idx === page
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-300"
              } hover:bg-gray-800 hover:text-white transition`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Product;
