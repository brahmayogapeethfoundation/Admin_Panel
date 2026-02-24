import React, { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 5;


const TestimonialRow = React.memo(({ testimonial, index, currentPage, onEdit, openModal }) => (
  <tr className="hover:bg-gray-100 transition">
    <td className="p-3 border">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
    <td className="p-3 border">{testimonial.name}</td>
    <td className="p-3 border">{testimonial.feedback}</td>
    <td className="p-3 border">{testimonial.rating}</td>
    <td className="p-3 border">
      {testimonial.photoUrl ? (
        <img
          src={testimonial.photoUrl}
          alt={testimonial.name}
          loading="lazy" 
          className="w-20 h-20 object-cover rounded shadow"
        />
      ) : (
        <span className="text-gray-400">No Photo</span>
      )}
    </td>
    <td className="p-3 border flex gap-2">
      <button
        className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500 transition"
        onClick={() => onEdit(testimonial)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
        onClick={() => openModal(testimonial.id)}
      >
        Delete
      </button>
    </td>
  </tr>
));

const TestimonialTable = ({
  testimonials = [],
  onEdit,
  onDelete,
  currentPage,
  setCurrentPage,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);


  const [localTestimonials, setLocalTestimonials] = useState(testimonials);

  
  React.useEffect(() => {
    setLocalTestimonials(Array.isArray(testimonials) ? testimonials : []);
  }, [testimonials]);

  const totalPages = Math.max(1, Math.ceil(localTestimonials.length / ITEMS_PER_PAGE));
  const paginatedTestimonials = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return localTestimonials.slice(start, start + ITEMS_PER_PAGE);
  }, [localTestimonials, currentPage]);

  const openModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
  
      setLocalTestimonials((prev) => prev.filter((t) => t.id !== deleteId));
      onDelete(deleteId);
    
      if (paginatedTestimonials.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
    setShowModal(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowModal(false);
    setDeleteId(null);
  };

  return (
    <div className="relative">
     
      <div className="hidden md:block overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border-collapse text-sm sm:text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 text-left border">#</th>
              <th className="p-3 text-left border">Name</th>
              <th className="p-3 text-left border">Feedback</th>
              <th className="p-3 text-left border">Rating</th>
              <th className="p-3 text-left border">Photo</th>
              <th className="p-3 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTestimonials.map((t, index) => (
              <TestimonialRow
                key={t.id}
                testimonial={t}
                index={index}
                currentPage={currentPage}
                onEdit={onEdit}
                openModal={openModal}
              />
            ))}
          </tbody>
        </table>
      </div>

   
      <div className="md:hidden flex flex-col gap-4 mt-4">
        {paginatedTestimonials.map((t, index) => (
          <div key={t.id} className="bg-white p-4 rounded shadow flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <span className="font-semibold">#{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>
              <div className="flex gap-2">
                <button
                  className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500 transition"
                  onClick={() => onEdit(t)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  onClick={() => openModal(t.id)}
                >
                  Delete
                </button>
              </div>
            </div>
            <div><span className="font-semibold">Name: </span>{t.name}</div>
            <div><span className="font-semibold">Feedback: </span>{t.feedback}</div>
            <div><span className="font-semibold">Rating: </span>{t.rating}</div>
            <div className="flex items-center gap-2">
              <span className="font-semibold">Photo: </span>
              {t.photoUrl ? (
                <img
                  src={t.photoUrl}
                  alt={t.name}
                  loading="lazy"
                  className="w-16 h-16 object-cover rounded shadow"
                />
              ) : (
                <span className="text-gray-400 text-xs">No Photo</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

   
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm animate-fadeIn">
            <h2 className="text-xl font-semibold mb-4">Delete Testimonial</h2>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete this testimonial? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialTable;
