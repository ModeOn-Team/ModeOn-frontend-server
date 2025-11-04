import { useEffect } from "react";

import useAdminStore from "../../store/adminStore";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";

const Product = () => {
  const {
    products,
    fetchProducts,
    categories,
    fetchCategories,
    ProductDelete,
  } = useAdminStore();
  
  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Product Management</h2>

      <ProductSearch categories={categories} />
      <ProductList
        products={products}
        ProductDelete={ProductDelete}
        onRefresh={fetchProducts}
      />
    </div>
  );
};

export default Product;
