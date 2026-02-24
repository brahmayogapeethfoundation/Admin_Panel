import React, { useEffect, useState } from "react";

const TestimonialForm = ({ onSubmit, initialData }) => {
  const [name, setName] = useState("");
  const [feedback, setFeedback] = useState("");
  const [rating, setRating] = useState(1);
  const [photo, setPhoto] = useState(null); // new selected image
  const [existingPhoto, setExistingPhoto] = useState(""); // existing image URL

 
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || "");
      setFeedback(initialData.feedback || "");
      setRating(initialData.rating || 1);
      setExistingPhoto(initialData.photoUrl || "");
      setPhoto(null);
    } else {
      setName("");
      setFeedback("");
      setRating(1);
      setExistingPhoto("");
      setPhoto(null);
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    
    onSubmit({
      name,
      feedback,
      rating,
      photo, 
    });

    // Reset form
    setName("");
    setFeedback("");
    setRating(1);
    setPhoto(null);
    setExistingPhoto("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 sm:p-6 rounded-lg shadow-md space-y-4"
    >
      <h2 className="text-lg sm:text-xl font-semibold">
        {initialData ? "Edit Testimonial" : "Add Testimonial"}
      </h2>

      <div className="flex flex-col sm:flex-row gap-6">
        
        <div className="flex-1 space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter name"
              className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Feedback</label>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Write feedback..."
              className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Rating</label>
            <input
              type="number"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              min="1"
              max="5"
              className="border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Upload Photo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files.length > 0) setPhoto(e.target.files[0]);
              }}
            />
          </div>
        </div>

       
        <div className="flex-1 flex flex-col items-center justify-start space-y-4">
          {photo ? (
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium mb-1">Selected Photo Preview</label>
              <img
                src={URL.createObjectURL(photo)}
                alt="Preview"
                className="w-40 h-40 object-cover rounded shadow"
              />
            </div>
          ) : existingPhoto ? (
            <div className="flex flex-col items-center">
              <label className="text-sm font-medium mb-1">Current Photo</label>
              <img
                src={existingPhoto}
                alt="Existing Testimonial"
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
        {initialData ? "Update Testimonial" : "Add Testimonial"}
      </button>
    </form>
  );
};

export default TestimonialForm;
