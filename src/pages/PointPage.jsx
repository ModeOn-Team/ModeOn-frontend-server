// src/pages/PointPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout.jsx";
import { getUserPoints } from "../services/point.js";

function PointPage() {
  const navigate = useNavigate();
  const [points, setPoints] = useState({ total: 0, history: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPoints = async () => {
      setLoading(true);
      try {
        const data = await getUserPoints();
        setPoints(data);
      } catch (err) {
        setError("포인트 정보를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPoints();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 text-center">
          <p className="text-gray-600">포인트 정보를 불러오는 중...</p>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto py-8 px-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* 뒤로가기 */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-600 hover:text-gray-900 font-semibold flex items-center gap-1"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold mb-8 text-center md:text-left">
          나의 포인트
        </h1>

        {/* 포인트 요약 */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-600">현재 보유 포인트</p>
              <p className="text-4xl font-bold text-green-700">
                {points.total.toLocaleString()} P
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">1P = 1원</p>
              <p className="text-sm text-gray-600">구매 시 1% 적립</p>
            </div>
          </div>
        </div>

        {/* 포인트 내역 */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-800">
              포인트 적립/사용 내역
            </h2>
          </div>
          {points.history.length > 0 ? (
            <div className="divide-y">
              {points.history.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-medium text-gray-800">{item.reason}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(item.date).toLocaleString("ko-KR")}
                    </p>
                  </div>
                  <p
                    className={`font-bold ${
                      item.type === "earn" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {item.type === "earn" ? "+" : "-"}
                    {item.amount.toLocaleString()} P
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-gray-500">
              포인트 내역이 없습니다.
            </div>
          )}
        </div>

        {/* 안내 문구 */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <span className="text-xs">
            마지막 갱신: {new Date().toLocaleString("ko-KR")}
          </span>
        </div>
      </div>
    </MainLayout>
  );
}

export default PointPage;
