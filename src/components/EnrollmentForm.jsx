import React, { useState, useEffect, useMemo } from "react";

const EnrollmentForm = ({
  onSubmit,
  onClose,
  initialData,
  courses = [],
  accommodations = [],
}) => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    country: "",
    courseId: "",
    paymentMode: "",
    accommodationId: "",
  });

  const [errors, setErrors] = useState({});


  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || "",
        email: initialData.email || "",
        phone: initialData.phone || "",
        gender: initialData.gender || "",
        country: initialData.country || "",
        courseId: initialData.courseId || "",
        paymentMode: initialData.paymentMode || "",
        accommodationId: initialData.accommodationId || "",
      });
    }
  }, [initialData]);

  const selectedCourse = useMemo(
    () => courses.find((c) => c.id === Number(formData.courseId)),
    [formData.courseId, courses]
  );

  const selectedAccommodation = useMemo(
    () =>
      accommodations.find(
        (a) => a.id === Number(formData.accommodationId)
      ),
    [formData.accommodationId, accommodations]
  );


  const durationDays = useMemo(() => {
    if (!selectedCourse?.duration) return 0;
    const text = selectedCourse.duration.toLowerCase();
    const num = parseInt(text.replace(/\D/g, "")) || 0;
    if (text.includes("week")) return num * 7;
    if (text.includes("month")) return num * 30;
    return num;
  }, [selectedCourse]);

  const coursePrice = Number(selectedCourse?.price || 0);

  const accommodationCost = useMemo(() => {
    if (!selectedAccommodation || durationDays === 0) return 0;
    return durationDays * Number(selectedAccommodation.price);
  }, [selectedAccommodation, durationDays]);

  const totalAmount = coursePrice + accommodationCost;


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  
  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim())
      newErrors.fullName = "Full name is required";

    if (!formData.email.trim())
      newErrors.email = "Email is required";

    if (!formData.gender)
      newErrors.gender = "Gender is required";

    if (!formData.country.trim())
      newErrors.country = "Country is required";

    if (!formData.courseId)
      newErrors.courseId = "Please select a course";

    if (!formData.paymentMode)
      newErrors.paymentMode = "Please select payment mode";

    // ❌ PHONE VALIDATION REMOVED (IMPORTANT FIX)

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      ...formData,
      courseId: Number(formData.courseId),
      accommodationId: formData.accommodationId
        ? Number(formData.accommodationId)
        : null,
      totalPrice: totalAmount,
    };

    onSubmit(payload); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-4 overflow-auto">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow-lg p-6 relative">
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-2xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold text-center mb-4">
          {initialData ? "Edit Enrollment" : "Add Enrollment"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
         
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <input
              name="phone"
              placeholder="+CountryCode Phone"
              value={formData.phone}
              onChange={handleChange}
              className="border p-2 rounded"
            />

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="border p-2 rounded"
            >
              <option value="">Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>

            <input
              name="country"
              placeholder="Country"
              value={formData.country}
              onChange={handleChange}
              className="border p-2 rounded sm:col-span-2"
            />
          </div>

        
          <select
            name="courseId"
            value={formData.courseId}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title} – ₹{c.price}
              </option>
            ))}
          </select>

          
          <select
            name="paymentMode"
            value={formData.paymentMode}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Payment Mode</option>
            <option value="PAY_NOW">Pay Now</option>
            <option value="PAY_LATER">Pay Later</option>
          </select>

          
          <select
            name="accommodationId"
            value={formData.accommodationId}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="">Accommodation (Optional)</option>
            {accommodations.map((a) => (
              <option key={a.id} value={a.id}>
                {a.type} – ₹{a.price}/day
              </option>
            ))}
          </select>

          
          <div className="bg-gray-100 p-3 rounded font-semibold">
            Total Amount: ₹{totalAmount}
          </div>

     
          <div className="flex justify-end gap-2">
            <button className="bg-blue-600 text-white px-6 py-2 rounded">
              {initialData ? "Update" : "Add"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EnrollmentForm;
