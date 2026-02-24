import React, { useEffect, useState } from "react";
import { getInstructors, getAccommodations } from "../api/api";

const CourseForm = ({ onSubmit, initialData }) => {
  const [form, setForm] = useState({
    title: "",
    shortDescription: "",
    longDescription: "",
    price: "",
    rating: "",
    category: "",
    schedule: "",
    duration: "",
    mode: "",
    isVisible: true,
    instructorId: "",
    accommodationIds: [],
  });

  const [mainImage, setMainImage] = useState(null);
  const [mainPreview, setMainPreview] = useState(null);
  const [removeMain, setRemoveMain] = useState(false);

  const [optionImage1, setOptionImage1] = useState(null);
  const [optionPreview1, setOptionPreview1] = useState(null);
  const [removeOption1, setRemoveOption1] = useState(false);

  const [optionImage2, setOptionImage2] = useState(null);
  const [optionPreview2, setOptionPreview2] = useState(null);
  const [removeOption2, setRemoveOption2] = useState(false);

  const [optionImage3, setOptionImage3] = useState(null);
  const [optionPreview3, setOptionPreview3] = useState(null);
  const [removeOption3, setRemoveOption3] = useState(false);

  const [instructors, setInstructors] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [step, setStep] = useState(1);

  useEffect(() => {
    (async () => {
      setInstructors(await getInstructors());
      setAccommodations(await getAccommodations());
    })();
  }, []);

  useEffect(() => {
    if (!initialData) return;

    // Set form fields
    setForm({
      title: initialData.title || "",
      shortDescription: initialData.shortDescription || "",
      longDescription: initialData.longDescription || "",
      price: initialData.price || "",
      rating: initialData.rating || "",
      category: initialData.category || "",
      schedule: initialData.schedule || "",
      duration: initialData.duration || "",
      mode: initialData.mode || "",
      isVisible: initialData.isVisible ?? true,
      instructorId: initialData.instructor?.id ? String(initialData.instructor.id) : "",
      accommodationIds: initialData.accommodations?.map(a => a.id) || [],
    });

    setMainPreview(initialData.imageUrl || null);
    setOptionPreview1(initialData.optionImage1 || null);
    setOptionPreview2(initialData.optionImage2 || null);
    setOptionPreview3(initialData.optionImage3 || null);

    setMainImage(null);
    setOptionImage1(null);
    setOptionImage2(null);
    setOptionImage3(null);

    setRemoveMain(false);
    setRemoveOption1(false);
    setRemoveOption2(false);
    setRemoveOption3(false);
  }, [initialData]);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleAccommodationToggle = id => {
    setForm(prev => ({
      ...prev,
      accommodationIds: prev.accommodationIds.includes(id)
        ? prev.accommodationIds.filter(x => x !== id)
        : [...prev.accommodationIds, id],
    }));
  };

  const handleMainImageChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    setMainImage(file);
    setMainPreview(URL.createObjectURL(file));
    setRemoveMain(false);
  };
  const handleOptionImageChange1 = e => {
    const file = e.target.files[0];
    if (!file) return;
    setOptionImage1(file);
    setOptionPreview1(URL.createObjectURL(file));
    setRemoveOption1(false);
  };
  const handleOptionImageChange2 = e => {
    const file = e.target.files[0];
    if (!file) return;
    setOptionImage2(file);
    setOptionPreview2(URL.createObjectURL(file));
    setRemoveOption2(false);
  };
  const handleOptionImageChange3 = e => {
    const file = e.target.files[0];
    if (!file) return;
    setOptionImage3(file);
    setOptionPreview3(URL.createObjectURL(file));
    setRemoveOption3(false);
  };

  const removeImage = key => {
    if (key === "main") {
      setMainImage(null);
      setMainPreview(null);
      setRemoveMain(true);
    } else if (key === "option1") {
      setOptionImage1(null);
      setOptionPreview1(null);
      setRemoveOption1(true);
    } else if (key === "option2") {
      setOptionImage2(null);
      setOptionPreview2(null);
      setRemoveOption2(true);
    } else if (key === "option3") {
      setOptionImage3(null);
      setOptionPreview3(null);
      setRemoveOption3(true);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (!form.title.trim()) {
      alert("Title is required");
      return;
    }

    const payload = {
      ...form,
      price: form.price ? Number(form.price) : null,
      rating: form.rating ? Number(form.rating) : null,
      instructorId: form.instructorId ? Number(form.instructorId) : null,
      removeMainImage: removeMain,
      removeOptionImage1: removeOption1,
      removeOptionImage2: removeOption2,
      removeOptionImage3: removeOption3,
      existingMainImage: mainImage ? null : mainPreview,
      existingOptionImage1: optionImage1 ? null : optionPreview1,
      existingOptionImage2: optionImage2 ? null : optionPreview2,
      existingOptionImage3: optionImage3 ? null : optionPreview3,
    };

    onSubmit(payload, mainImage, optionImage1, optionImage2, optionImage3);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-3xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">{initialData ? "Update Course" : "Add Course"}</h2>

      {/* Step 1 */}
      {step === 1 && (
        <div className="grid md:grid-cols-2 gap-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Course Title" className="md:col-span-2 border p-2" />
          <input name="category" value={form.category} onChange={handleChange} placeholder="Category" className="border p-2" />

          <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} placeholder="Short Description" className="md:col-span-2 border p-2" />
          <textarea name="longDescription" value={form.longDescription} onChange={handleChange} rows={4} placeholder="Long Description" className="md:col-span-2 border p-2" />

          <input name="schedule" value={form.schedule} onChange={handleChange} placeholder="Schedule" className="border p-2" />

        <input name="duration" value={form.duration} onChange={handleChange} placeholder="Duration" className="border p-2" />
          <input name="mode" value={form.mode} onChange={handleChange} placeholder="Mode" className="border p-2" />

          <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Price" className="border p-2" />
          <input type="number" name="rating" value={form.rating} onChange={handleChange} placeholder="Rating" className="border p-2" />
          
          

          <select name="instructorId" value={form.instructorId} onChange={handleChange} className="border p-2 md:col-span-2" required>
            <option value="">Select Instructor</option>
            {instructors.map(ins => <option key={ins.id} value={ins.id}>{ins.name} – {ins.role}</option>)}
          </select>

        </div>
      )}

      {step === 2 && (
        <>
          {/* Main Image */}
          <div>
            <label>Card Image : </label>
            <input type="file" accept="image/*" onChange={handleMainImageChange} />
            {mainPreview && (
              <div className="relative mt-2">
                <img src={mainPreview} className="w-40 rounded" />
                <button type="button" onClick={() => removeImage("main")} className="absolute top-0 right-0 bg-red-600 text-white px-2 rounded">×</button>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label>Course Image : </label>
            <input type="file" accept="image/*" onChange={handleOptionImageChange1} />
            {optionPreview1 && (
              <div className="relative mt-2">
                <img src={optionPreview1} className="w-32 h-32 object-cover rounded" />
                <button type="button" onClick={() => removeImage("option1")} className="absolute top-0 right-0 bg-red-600 text-white px-2 rounded">×</button>
              </div>
            )}
          </div>

          {/* <div className="mt-4">
            <label>Option Image 2</label>
            <input type="file" accept="image/*" onChange={handleOptionImageChange2} />
            {optionPreview2 && (
              <div className="relative mt-2">
                <img src={optionPreview2} className="w-32 h-32 object-cover rounded" />
                <button type="button" onClick={() => removeImage("option2")} className="absolute top-0 right-0 bg-red-600 text-white px-2 rounded">×</button>
              </div>
            )}
          </div>

          <div className="mt-4">
            <label>Option Image 3</label>
            <input type="file" accept="image/*" onChange={handleOptionImageChange3} />
            {optionPreview3 && (
              <div className="relative mt-2">
                <img src={optionPreview3} className="w-32 h-32 object-cover rounded" />
                <button type="button" onClick={() => removeImage("option3")} className="absolute top-0 right-0 bg-red-600 text-white px-2 rounded">×</button>
              </div>
            )}
          </div> */}
        </>
      )}

      {step === 3 && (

        <div>
            <div className="mb-4">
              <h3 className="text-xl  text-gray-800">Add Accommodations</h3>
            </div>

        <br />
        <div className="grid md:grid-cols-2 gap-2">
         
          {accommodations.map(acc => (
            <label key={acc.id} className="flex items-center gap-2">
              <input type="checkbox" checked={form.accommodationIds.includes(acc.id)} onChange={() => handleAccommodationToggle(acc.id)} />
              {acc.type} – ₹{acc.price}
            </label>
          ))}
        </div>
        </div>
       
      )}

      <div className="flex justify-between mt-6 flex-wrap gap-2">
        {step > 1 && (
          <button type="button" onClick={() => setStep(step - 1)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">← Back</button>
        )}
        {step < 3 && (
          <button type="button" onClick={() => setStep(step + 1)} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Next →</button>
        )}
        {step === 3 && (
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
            {initialData ? "Update Course" : "Add Course"}
          </button>
        )}
      </div>
    </form>
  );
};

export default CourseForm;
