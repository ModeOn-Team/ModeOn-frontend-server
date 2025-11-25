import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../lib/api";

export default function AdminRequestDetail() {
  const { id } = useParams();
  const [info, setInfo] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  useEffect(() => {
    const load = async () => {
      const res = await api.get(`/api/admin/history/${id}`);
      setInfo(res.data);
    };
    load();
  }, [id]);

  if (!info) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">요청 상세 정보</h2>

      <p>상품명: {info.productName}</p>
      <p>요청자: {info.username}</p>
      <p>사유: {info.requestReason}</p>

      <h3 className="font-semibold mt-4">사용자 첨부 이미지</h3>

      {info.images && info.images.length > 0 ? (
        <div className="grid grid-cols-3 gap-4 mt-2">
          {info.images.map((img, idx) => (
            <img
  key={idx}
  src={API_URL + img}
  className="w-full h-40 object-cover rounded border"
/>

          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-400">첨부된 이미지 없음</p>
      )}
    </div>
  );
}
