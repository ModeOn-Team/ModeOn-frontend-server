
const ProductImageForm = ({ images, setImages, imageFiles, setImageFiles }) => {

  const handleAddImage = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const newImages = files.map((file) => URL.createObjectURL(file));
    setImages([...images, ...newImages]);
    setImageFiles([...imageFiles, ...files]);
  };

  return (
    <div className="flex flex-col gap-2 mt-4">
      <label className="font-medium">Images</label>
      <div className="flex gap-2 flex-wrap">
        {images.map((img, idx) => {
          const isThumbnail = idx === 0;
          return (
            <div key={idx} className="relative">
              <img
                src={img}
                alt={isThumbnail ? "Thumbnail" : `Detail ${idx}`}
                className={`object-cover border ${
                  isThumbnail ? "w-32 h-32" : "w-24 h-24"
                }`}
              />
              {isThumbnail && (
                <div className="absolute top-1 left-1 bg-amber-600 text-white text-xs px-1 rounded">
                  대표 이미지
                </div>
              )}
              {!isThumbnail && (
                <button
                  type="button"
                  className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded hover:bg-black"
                  onClick={() => {
                    const newImages = [...images];
                    const temp = newImages[0];
                    newImages[0] = newImages[idx];
                    newImages[idx] = temp;
                    setImages(newImages);

                    const newFiles = [...imageFiles];
                    const tempFile = newFiles[0];
                    newFiles[0] = newFiles[idx];
                    newFiles[idx] = tempFile;
                    setImageFiles(newFiles);
                  }}
                >
                  Set Thumbnail
                </button>
              )}
            </div>
          );
        })}

        <label className="w-24 h-24 flex items-center justify-center border cursor-pointer text-gray-500 hover:bg-gray-100">
          + Add
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleAddImage}
            className="hidden"
          />
        </label>
      </div>
    </div>
  );
};

export default ProductImageForm;
