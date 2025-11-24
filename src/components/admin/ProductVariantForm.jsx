const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "FREE"];
const COLORS = [
  { name: "WHITE", hex: "#FFFFFF" },
  { name: "BLACK", hex: "#000000" },
  { name: "GRAY", hex: "#808080" },
  { name: "BEIGE", hex: "#F5F5DC" },
  { name: "BROWN", hex: "#8B4513" },
  { name: "NAVY", hex: "#000080" },
  { name: "BLUE", hex: "#0000FF" },
  { name: "SKY_BLUE", hex: "#87CEEB" },
  { name: "GREEN", hex: "#008000" },
  { name: "KHAKI", hex: "#78866B" },
  { name: "YELLOW", hex: "#FFFF00" },
  { name: "ORANGE", hex: "#FFA500" },
  { name: "RED", hex: "#FF0000" },
  { name: "PINK", hex: "#FFC0CB" },
  { name: "PURPLE", hex: "#800080" },
  { name: "IVORY", hex: "#FFFFF0" },
  { name: "GOLD", hex: "#FFD700" },
  { name: "SILVER", hex: "#C0C0C0" },
];

const ProductVariantForm = ({
  selectedSizes, setSelectedSizes,
  selectedColors, setSelectedColors,
  variantList, setVariantList,
}) => {
  const toggleSize = (s) => {
    setSelectedSizes((prev) =>
      prev.includes(s) ? prev.filter((i) => i !== s) : [...prev, s]
    );
  };

  const toggleColor = (c) => {
    setSelectedColors((prev) =>
      prev.includes(c) ? prev.filter((i) => i !== c) : [...prev, c]
    );
  };

  const removeSize = (s) =>
    setSelectedSizes((prev) => prev.filter((i) => i !== s));
  const removeColor = (c) =>
    setSelectedColors((prev) => prev.filter((i) => i !== c));

  const handleCreateList = () => {
    if (selectedSizes.length === 0 || selectedColors.length === 0) {
      alert("색상과 사이즈를 최소 1개 이상 선택하세요.");
      return;
    }

    const combos = [];
    selectedSizes.forEach((size) => {
      selectedColors.forEach((color) => {
        combos.push({ size, color, stock: 1 });
      });
    });

    setVariantList(combos);
  };

  const handleSubmit = async () => {
    if (selectedSizes.length === 0 || selectedColors.length === 0) {
      alert("색상과 사이즈를 최소 1개 이상 선택하세요");
      return;
    }

    const combinations = [];
    selectedSizes.forEach((size) => {
      selectedColors.forEach((color) => {
        combinations.push({ size, color, stock });
      });
    });

    try {
      for (const combo of combinations) {
      }
      alert(`${combinations.length}개의 옵션이 생성되었습니다.`);
    } catch (err) {
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div>
      {/* 사이즈 선택 */}
      <div className="mb-4">
        <label className="font-semibold">사이즈 선택</label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => toggleSize(s)}
              className={`border px-3 py-1 rounded ${
                selectedSizes.includes(s)
                  ? "bg-blue-500 text-white"
                  : "bg-white"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* 선택된 사이즈 태그 */}
        <div className="flex gap-2 flex-wrap mt-2">
          {selectedSizes.map((s) => (
            <span
              key={s}
              className="px-2 py-1 bg-blue-100 rounded flex items-center gap-1"
            >
              {s}
              <button onClick={() => removeSize(s)} className="text-red-500">
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* 색상 선택 */}
      <div className="mb-4">
        <label className="font-semibold">색상 선택</label>
        <div className="grid grid-cols-4 gap-2 mt-2">
          {COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => toggleColor(c.name)}
              className={`border px-3 py-1 rounded ${
                selectedColors.includes(c.name)
                  ? "bg-green-500 text-white"
                  : "bg-white"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* 선택된 색상 태그 */}
        <div className="flex gap-2 flex-wrap mt-2">
          {selectedColors.map((c) => (
            <span
              key={c}
              className="px-2 py-1 bg-green-100 rounded flex items-center gap-1"
            >
              {c}
              <button onClick={() => removeColor(c)} className="text-red-500">
                ✕
              </button>
            </span>
          ))}
        </div>
      </div>

      <button
        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
        onClick={handleCreateList}
      >
        옵션별 재고 추가
      </button>
      {variantList.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">생성된 옵션 목록</h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">사이즈</th>
                <th className="border px-2 py-1">색상</th>
                <th className="border px-2 py-1">재고</th>
              </tr>
            </thead>
            <tbody>
              {variantList.map((v, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">{v.size}</td>
                  <td className="border px-2 py-1">{v.color}</td>
                  <td className="border px-2 py-1">
                    <input
                      type="number"
                      min="1"
                      value={v.stock}
                      onChange={(e) => {
                        const newList = [...variantList];
                        newList[i].stock = Number(e.target.value);
                        setVariantList(newList);
                      }}
                      className="border px-1 py-0.5 w-20"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
  );
};

export default ProductVariantForm;
