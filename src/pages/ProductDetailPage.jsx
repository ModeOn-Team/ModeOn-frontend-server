import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import useProductStore from "../store/ProductStore";
import MainLayout from "../components/layout/MainLayout";
import ProductDetailSide from "../components/product/ProductDetailSide";
import ProductDetailMain from "../components/product/ProductDetailMain";
import { reviewService } from "../services/reviewService";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { fetchProductById, selectedProduct, loading } = useProductStore();

  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchProductById(id);


    const loadReviews = async () => {
      try {
        const list = await reviewService.getReviewsByProduct(id);
        setReviews(list);
      } catch (err) {
        console.error("리뷰 불러오기 실패:", err);
      }
    };

    loadReviews();
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


      <div className="px-40 mt-10">
        <h2 className="text-2xl font-semibold mb-6">이 상품 사용자 후기</h2>

        {reviews.length === 0 ? (
          <p className="text-gray-500">아직 등록된 후기가 없습니다.</p>
        ) : (
          <div className="space-y-6">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="border rounded-xl p-5 bg-white shadow-sm"
              >
                <div className="flex justify-between mb-2">
                  <span className="font-medium">{r.userName}</span>
                  <span className="text-yellow-500 text-lg">
                    {"⭐".repeat(r.rating)}
                  </span>
                </div>

                <p className="text-gray-800 whitespace-pre-line">
                  {r.content}
                </p>

                <p className="text-gray-400 text-xs mt-2">{r.createdAt}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ProductDetailPage;
