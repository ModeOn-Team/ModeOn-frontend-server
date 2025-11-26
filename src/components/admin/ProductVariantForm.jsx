import { useEffect, useState } from "react";

const ProductVariantForm = ({
  variantOptions,
  selectedValues,
  setSelectedValues,
  variantList,
  setVariantList,
}) => {
  const [selectedGuideId, setSelectedGuideId] = useState(null);

  useEffect(() => {
    if (!variantOptions) return;

    const initValues = {};
    variantOptions.optionGuides.forEach((guide) => {
      guide.standardPurchaseOptions.forEach((opt) => {
        initValues[opt.optionId] = [];
      });
    });
    setSelectedValues(initValues);
    setSelectedGuideId(null);
  }, [variantOptions, setSelectedValues]);

  const handleGuideSelect = (guideId) => {
    setSelectedGuideId(guideId);
  };

  const toggleValue = (optionId, value) => {
    setSelectedValues((prev) => ({
      ...prev,
      [optionId]: prev[optionId].includes(value)
        ? prev[optionId].filter((v) => v !== value)
        : [...prev[optionId], value],
    }));
  };

  const handleCreateList = () => {
    if (!selectedGuideId) {
      alert("옵션 가이드를 선택해주세요.");
      return;
    }

    const guide = variantOptions.optionGuides.find(
      (g) => g.guideId === selectedGuideId
    );
    if (!guide) return;

    const groups = guide.standardPurchaseOptions.map(
      (opt) => selectedValues[opt.optionId]
    );

    if (groups.some((g) => !g || g.length === 0)) {
      alert("모든 옵션에서 최소 1개 이상 선택하세요.");
      return;
    }

    const optionIds = guide.standardPurchaseOptions.map((o) => o.optionId);

    const cartesian = groups.reduce(
      (acc, cur) => acc.flatMap((a) => cur.map((b) => [...a, b])),
      [[]]
    );

    console.log("guide:", guide);

    const result = cartesian.map((combo) => ({
      options: optionIds.map((id, index) => {
        const opt = guide.standardPurchaseOptions.find(
          (o) => o.optionId === Number(id)
        );
        return {
          optionId: Number(id),
          optionName: opt.optionName,
          valueName: combo[index],
        };
      }),
      guideId: selectedGuideId,
      stock: 1,
    }));

    setVariantList(result);
  };

  const selectedGuide = variantOptions?.optionGuides.find(
    (g) => g.guideId === selectedGuideId
  );

  const dbOptionValues = ["색상", "사이즈"];

  return (
    <div className="p-4 border rounded-lg mt-5">
      <h2 className="font-semibold mb-4 text-lg">상품 옵션 설정</h2>

      <div className="mb-4">
        <label className="font-semibold">판매옵션명 선택</label>
        <select
          className="border px-2 py-1 rounded w-full mt-2"
          value={selectedGuideId || ""}
          onChange={(e) => handleGuideSelect(Number(e.target.value))}
        >
          <option value="">-- 판매옵션 선택 --</option>
          {variantOptions?.optionGuides.map((guide) => {
            const label = guide.standardPurchaseOptions
              .map((o) => o.optionName)
              .join(" + ");

            const isDisabled = !guide.standardPurchaseOptions.every((o) =>
              dbOptionValues.includes(o.optionName)
            );

            return (
              <option
                key={guide.guideId}
                value={guide.guideId}
                disabled={isDisabled}
              >
                {label}
              </option>
            );
          })}
        </select>
      </div>

      {selectedGuide?.standardPurchaseOptions.map((opt) => (
        <div key={opt.optionId} className="mb-4">
          <label className="font-semibold">{opt.optionName}</label>

          <div className="flex flex-wrap gap-2 mt-2">
            {opt.optionValues.map((v) => (
              <button
                key={v.valueName}
                className={`border px-2 py-1 rounded ${
                  selectedValues[opt.optionId]?.includes(v.valueName)
                    ? "bg-blue-500 text-white"
                    : "bg-white"
                }`}
                onClick={() => toggleValue(opt.optionId, v.valueName)}
              >
                {v.valueName}
              </button>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleCreateList}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 mt-4"
      >
        옵션 조합 생성
      </button>

      {variantList.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">생성된 옵션 조합</h3>
          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">옵션 내용</th>
                <th className="border px-2 py-1">재고</th>
              </tr>
            </thead>
            <tbody>
              {variantList.map((v, i) => (
                <tr key={i}>
                  <td className="border px-2 py-1">
                    {v.options.map((opt) => (
                      <div key={opt.optionId}>
                        {opt.optionName}: {opt.valueName}
                      </div>
                    ))}
                  </td>
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
