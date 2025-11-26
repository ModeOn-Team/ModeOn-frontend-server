import { useState } from "react";
import ProductForm from "./ProductForm";

const ProductSearch = ({ categories }) => {
  const [selectedDepth0, setSelectedDepth0] = useState(null);
  const [selectedDepth1, setSelectedDepth1] = useState(null);
  const [selectedDepth2, setSelectedDepth2] = useState(null);

  const depth0Categories = categories.filter((cat) => cat.depth === 0);
  const depth1Categories = selectedDepth0
    ? categories.filter((cat) => cat.depth === 1 && cat.parentId === selectedDepth0)
    : categories.filter((cat) => cat.depth === 1);
  const depth2Categories = selectedDepth1
    ? categories.filter((cat) => cat.depth === 2 && cat.parentId === selectedDepth1)
    : categories.filter((cat) => cat.depth === 2);

  const selectedPath = [
    depth0Categories.find((c) => c.id === selectedDepth0)?.name,
    depth1Categories.find((c) => c.id === selectedDepth1)?.name,
    depth2Categories.find((c) => c.id === selectedDepth2)?.name,
  ]
    .filter(Boolean)
    .join(" > ");

  return (
    <div>
      <div className="p-6 border rounded-lg bg-white shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 mb-4 items-center">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Gender</label>
            <select className="border rounded p-2 w-32">
              <option>ALL</option>
              <option>MAN</option>
              <option>WOMAN</option>
              <option>UNISEX</option>
              <option>KIDS</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Large Category</label>
            <select
              className="border rounded p-2 w-40"
              value={selectedDepth0 || ""}
              onChange={(e) => {
                setSelectedDepth0(Number(e.target.value) || null);
                setSelectedDepth1(null);
                setSelectedDepth2(null);
              }}
            >
              <option value="">ALL</option>
              {depth0Categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Middle Category</label>
            <select
              className="border rounded p-2 w-40"
              value={selectedDepth1 || ""}
              onChange={(e) => {
                setSelectedDepth1(Number(e.target.value) || null);
                setSelectedDepth2(null);
              }}
            >
              <option value="">ALL</option>
              {depth1Categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Small Category</label>
            <select
              className="border rounded p-2 w-40"
              value={selectedDepth2 || ""}
              onChange={(e) => setSelectedDepth2(Number(e.target.value) || null)}
            >
              <option value="">ALL</option>
              {depth2Categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            className="flex-1 border rounded p-2"
          />
          <button className="text-white px-4 py-2 rounded bg-black hover:bg-red-400">
            Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSearch;
