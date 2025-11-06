import { useEffect, useState } from "react";

import { ProductService } from "../../services/product";
import ProductList from "./ProductList";
import { useNavigate } from "react-router-dom";

const Product = () => {
  const navigate = useNavigate();

  const [allProducts, setAllProducts] = useState([]);
  const [manProducts, setManProducts] = useState([]);
  const [womanProducts, setWomanProducts] = useState([]);
  const [kidsProducts, setKidsProducts] = useState([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const all = await ProductService.getAllProducts(0);
        const man = await ProductService.ProductSearch({
          gender: "MAN",
          pageSize: 5,
        });
        const woman = await ProductService.ProductSearch({
          gender: "WOMAN",
          pageSize: 5,
        });
        const kids = await ProductService.ProductSearch({
          gender: "KIDS",
          pageSize: 5,
        });

        setAllProducts(all.content || []);
        setManProducts(man.content || []);
        setWomanProducts(woman.content || []);
        setKidsProducts(kids.content || []);
      } catch (err) {
        console.error("Failed to load products:", err);
      }
    };

    loadProducts();
  }, []);

  const haddleViewMore = (gender) => {
    navigate(`/product?gender=${gender}`);
  };

  return (
    <div>
      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-4">Explore Our Product</h2>
        <button
          onClick={() => haddleViewMore(null)}
          className="text-sm text-gray-700 hover:text-red-500 font-medium"
        >
          View More →
        </button>
      </div>
      <ProductList products={allProducts} pageSize={5} />

      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-4 mt-10">Product For Man</h2>
        <button
          onClick={() => haddleViewMore("MAN")}
          className="text-sm text-gray-700 hover:text-red-500 font-medium"
        >
          View More →
        </button>
      </div>
      <ProductList
        products={manProducts}
        pageSize={5}
      />

      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-4 mt-10">Product For Woman</h2>
        <button
          onClick={() => haddleViewMore("WOMAN")}
          className="text-sm text-gray-700 hover:text-red-500 font-medium"
        >
          View More →
        </button>
      </div>
      <ProductList
        products={womanProducts}
        pageSize={5}
      />

      <div className="flex flex-row justify-between">
        <h2 className="text-2xl font-bold mb-4 mt-10">Product For Kids</h2>
        <button
          onClick={() => haddleViewMore("KIDS")}
          className="text-sm text-gray-700 hover:text-red-500 font-medium"
        >
          View More →
        </button>
      </div>
      <ProductList
        products={kidsProducts}
        pageSize={5}
      />
    </div>
  );
};

export default Product;
