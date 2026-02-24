import React, { useEffect, useState } from "react";

const AccommodationForm = ({ onSubmit, initialData }) => {
  const [type, setType] = useState("");
  const [price, setPrice] = useState("0"); 
  const [image, setImage] = useState(null); 
  const [existingImage, setExistingImage] = useState("");

 
  useEffect(() => {
    if (initialData) {
      setType(initialData.type || "");
      setPrice(initialData.price != null ? initialData.price.toString() : "0");
      setExistingImage(initialData.imageUrl || "");
      setImage(null);
    } else {
      setType("");
      setPrice("0");
      setExistingImage("");
      setImage(null);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!type.trim()) return alert("Type is required");

    if (price === "" || price === null) return alert("Price is required");

    const numericPrice = Number(price);
    if (numericPrice < 0) return alert("Price cannot be negative");

    const formData = new FormData();
    const accommodationData = {
      type: type.trim(),
      price: numericPrice,
    };

    formData.append("accommodation", JSON.stringify(accommodationData));

    if (image) formData.append("image", image);

    onSubmit(formData);

  
    setType("");
    setPrice("0");
    setImage(null);
    setExistingImage("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-lg sm:text-xl font-semibold">
        {initialData ? "Edit Accommodation" : "Add Accommodation"}
      </h2>

      <div className="flex flex-col sm:flex-row gap-6">
        
        <div className="flex-1 space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Type</label>
            <input
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              placeholder="Shared Room, Private Room..."
              className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Price</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
              min="0" // ✅ prevent negative
              step="0.01"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter 0 if free accommodation
            </p>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files.length > 0) setImage(e.target.files[0]);
              }}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-start space-y-4">
          {image ? (
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium mb-1">Selected Image Preview</label>
              <img
                src={URL.createObjectURL(image)}
                alt="Preview"
                className="w-40 h-40 object-cover rounded shadow"
              />
            </div>
          ) : existingImage ? (
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium mb-1">Current Image</label>
              <img
                src={existingImage}
                alt="Accommodation"
                className="w-40 h-40 object-cover rounded shadow"
              />
            </div>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        {initialData ? "Update Accommodation" : "Save Accommodation"}
      </button>
    </form>
  );
};

export default AccommodationForm;
