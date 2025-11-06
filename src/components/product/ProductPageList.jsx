import ProductPageCard from "./ProductPageCard";

const ProductPageList = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No Product yet. Be the first to Product</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-5 gap-6 p-4">
      {products.map((product) => (
        <ProductPageCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductPageList;
