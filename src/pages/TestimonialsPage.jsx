import React, { useEffect, useRef, useState } from "react";
import TestimonialForm from "../components/TestimonialForm";
import TestimonialTable from "../components/TestimonialTable";
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader"; 

const ITEMS_PER_PAGE = 5;

const TestimonialsPage = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); 
  const formRef = useRef(null);

 
  const fetchTestimonials = async () => {
    try {
      setLoading(true); // ✅ show loader
      const data = await getTestimonials();
      setTestimonials(data || []);
    } catch {
      // toast.error("Failed to fetch testimonials");
    } finally {
      setLoading(false); // ✅ hide loader
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  
  const handleAddOrUpdate = async (data) => {
    try {
      setLoading(true); // ✅ show loader while saving
      if (editing) {
        await updateTestimonial(editing.id, data);
        toast.success("Testimonial updated successfully");
        setEditing(null);
      } else {
        await createTestimonial(data);
        toast.success("Testimonial added successfully");

        // Go to last page after adding
        const totalItems = testimonials.length + 1;
        const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
        setCurrentPage(lastPage);
      }
      setFormOpen(false);
      await fetchTestimonials(); // refresh after add/update
    } catch {
      toast.error("Operation failed");
    } finally {
      setLoading(false); // ✅ hide loader
    }
  };

  
  const handleEdit = (t) => {
    setEditing(t);
    setFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };


  const handleDelete = async (id) => {
    try {
      setLoading(true); // ✅ show loader while deleting
      await deleteTestimonial(id);
      toast.success("Testimonial deleted successfully");

      // Adjust current page if needed
      const totalItems = testimonials.length - 1;
      const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
      setCurrentPage((prev) => Math.min(prev, totalPages));

      await fetchTestimonials(); // refresh after delete
    } catch {
      toast.error("Failed to delete testimonial");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="flex-1 p-4 md:p-6">
        <Toaster position="top-right" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Testimonials Dashboard
          </h1>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
            onClick={() => {
              setFormOpen(!formOpen);
              setEditing(null);
              setTimeout(() => {
                formRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }, 100);
            }}
          >
            {formOpen ? "Close Form" : "Add Testimonial"}
          </button>
        </div>

        {/* Loader */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <>
            {/* Form */}
            {formOpen && (
              <div ref={formRef} className="mb-6">
                <TestimonialForm onSubmit={handleAddOrUpdate} initialData={editing} />
              </div>
            )}

            {/* Table */}
            <TestimonialTable
              testimonials={testimonials}
              onEdit={handleEdit}
              onDelete={handleDelete}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default TestimonialsPage;
