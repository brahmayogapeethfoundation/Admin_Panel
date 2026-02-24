import React, { useState, useEffect } from "react";

const GalleryForm = ({ onSubmit, initialData }) => {
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null); 
  const [errors, setErrors] = useState({}); 

  useEffect(() => {
    if (initialData) {
      setCategory(initialData.category || "");
      setPreview(initialData.imageUrl || null); 
    }
  }, [initialData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file)); 
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!category.trim()) newErrors.category = "Category is required";
    if (!image && !preview) newErrors.image = "Image is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return; 

    onSubmit({ category, image });

   
    if (!initialData) {
      setCategory("");
      setImage(null);
      setPreview(null);
      setErrors({});
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 shadow rounded space-y-4">
      <div>
        <input
          type="text"
          placeholder="Category"
          className={`border p-2 w-full ${errors.category ? "border-red-500" : ""}`}
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
        <input type="file" onChange={handleImageChange} />
        {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        {preview && (
          <div className="mt-2">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover border rounded"
            />
          </div>
        )}
      </div>

      <button type="submit" className="bg-blue-600 text-white p-2 rounded">
        {initialData ? "Update" : "Add"}
      </button>
    </form>
  );
};

export default GalleryForm;
