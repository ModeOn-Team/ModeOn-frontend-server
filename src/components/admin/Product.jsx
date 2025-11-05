import { useEffect } from "react";

import useAdminStore from "../../store/adminStore";
import ProductList from "./ProductList";
import ProductSearch from "./ProductSearch";
import useProductStore from "../../store/ProductStore";

const Product = () => {
  const { ProductDelete } = useAdminStore();
  const { categories, products, fetchCategories, fetchProducts } = useProductStore();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

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
