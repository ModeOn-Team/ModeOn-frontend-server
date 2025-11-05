const ProductDetailMain = ({ name, detailImages = [] }) => {
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const mainImage =
    detailImages.length > 0
      ? API_URL + "/" + detailImages[0]
      : API_URL + "/images/no-image.png";

  return (
    <>
      {/* 메인 이미지 + 썸네일 */}
      <div className="flex justify-center items-start w-full gap-8">
        <div className="flex flex-col items-center gap-4">
          {detailImages.length > 0 ? (
            detailImages.map((img, idx) => (
              <img
                key={idx}
                src={API_URL + "/" + img}
                alt={`${name}-${idx}`}
                className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:scale-105 transition-transform border border-gray-300"
              />
            ))
          ) : (
            <></>
          )}
        </div>

        <img
          src={mainImage}
          alt={name}
          className="w-1/2 rounded-xl object-cover shadow-md"
        />
      </div>

      {/* 상세 이미지 구분선 + 제목 */}
      <div className="relative mt-16 mb-12 flex items-center justify-center">
        <div className="absolute w-3/4 h-px bg-gray-300"></div>
        <span className="relative bg-white px-6 text-2xl font-semibold text-gray-700">
          상세 이미지
        </span>
      </div>

      {/* 상세 이미지 리스트 */}
      <div className="flex flex-col items-center gap-6">
        {detailImages.length > 0 ? (
          detailImages.map((img, idx) => (
            <img
              key={idx}
              src={API_URL + "/" + img}
              alt={`${name}-detail-${idx}`}
              className="w-3/4 rounded-lg shadow-sm object-cover"
            />
          ))
        ) : (
          <p className="text-gray-400">상세 이미지가 없습니다.</p>
        )}
      </div>
    </>
  );
};

export default ProductDetailMain;
