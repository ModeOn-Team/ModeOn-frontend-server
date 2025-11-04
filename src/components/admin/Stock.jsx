import StockList from "./StockList";
import { useEffect } from "react";

import useAdminStore from "../../store/adminStore";


const Stock = () => {
    const { products, fetchProducts, ProductVariantUpdate } =
    useAdminStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Stock Management</h2>
      <StockList products={products} ProductVariantUpdate={ProductVariantUpdate} onRefresh={fetchProducts}/>
    </div>
  );
};

export default Stock;
