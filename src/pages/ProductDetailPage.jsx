import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useProductStore from "../store/ProductStore";
import MainLayout from "../components/layout/MainLayout";
import ProductDetailSide from "../components/product/ProductDetailSide";
import ProductDetailMain from "../components/product/ProductDetailMain";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { fetchProductById, selectedProduct, loading } = useProductStore();


  useEffect(() => {
    fetchProductById(id);
  }, [id]);

  if (loading || !selectedProduct) {
    return (
      <MainLayout>
        <div className="py-20 text-center text-gray-500">Loading...</div>
      </MainLayout>
    );
  }

  const { category, detailImages, gender, name, price, description, variants, wishList  } = selectedProduct;

  return (
    <MainLayout>
      <div className="flex py-10 px-40 gap-10">
     
        <div className="w-2/3">
          <ProductDetailMain name={name} detailImages={detailImages}/>
        </div>

        <div className="w-1/3">
          <div className="sticky top-34 flex flex-col gap-3">
            <ProductDetailSide
            id={id}
              name={name}
              gender={gender}
              category={category}
              price={price}
              description={description}
              variants={variants}
              wishList={wishList}
            />
          </div>
        </div>
      </div>


    </MainLayout>
  );
};

export default ProductDetailPage;
