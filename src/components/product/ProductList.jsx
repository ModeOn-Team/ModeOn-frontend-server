import ProductCard from "./ProductCard";
import HomeProductCard from "./HomeProductCard";

const ProductList = ({ products, pageSize }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No Product yet. Be the first to Product</p>
      </div>
    );
  }

  if (pageSize) {
    return (
      <div className="grid grid-cols-5 gap-6 p-4">
        {products.slice(0, pageSize).map((product) => (
          <HomeProductCard
            key={product.id}
            product={product}
            pageSize={pageSize}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-6 p-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
