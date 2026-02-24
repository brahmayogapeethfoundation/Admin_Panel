import React, { useEffect, useMemo, useState } from "react";

const ITEMS_PER_PAGE = 5;

const AccommodationTable = ({ accommodations = [], onEdit, onDelete}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [localAccommodations, setLocalAccommodations] = useState([]);
  const [page, setPage] = useState(1);


  useEffect(() => {
    setLocalAccommodations(Array.isArray(accommodations) ? accommodations : []);
    setPage(1);
  }, [accommodations]);

  
  const totalPages = Math.max(1, Math.ceil(localAccommodations.length / ITEMS_PER_PAGE));
  const paginatedAccommodations = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return localAccommodations.slice(start, start + ITEMS_PER_PAGE);
  }, [localAccommodations, page]);

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      onDelete(deleteId);
      setLocalAccommodations(prev => prev.filter(acc => acc.id !== deleteId));

   
      const newTotal = localAccommodations.length - 1;
      const newTotalPages = Math.max(1, Math.ceil(newTotal / ITEMS_PER_PAGE));
      if (page > newTotalPages) setPage(newTotalPages);
    }
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  

  return (
    <>
      
      <div className="hidden sm:block overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border-collapse text-sm sm:text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 sm:p-3 text-left border">#</th>
              <th className="p-2 sm:p-3 text-left border">Type</th>
              <th className="p-2 sm:p-3 text-left border">Price</th>
              <th className="p-2 sm:p-3 text-left border">Image</th>
              <th className="p-2 sm:p-3 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedAccommodations.map((acc, index) => (
              <tr key={acc.id} className="hover:bg-gray-100 transition">
                <td className="p-2 sm:p-3 border">{(page - 1) * ITEMS_PER_PAGE + index + 1}</td>
                <td className="p-2 sm:p-3 border">{acc.type}</td>
                <td className="p-2 sm:p-3 border">${acc.price}</td>
                <td className="p-2 sm:p-3 border">
                  {acc.imageUrl ? (
                    <img
                      src={acc.imageUrl}
                      alt={acc.type}
                      loading="lazy"
                      className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded shadow"
                      onError={(e) => e.target.src = "/placeholder.png"} // fallback if image fails
                    />
                  ) : (
                    <span className="text-gray-400 text-xs sm:text-sm">No Image</span>
                  )}
                </td>
                <td className="p-2 sm:p-3 border flex flex-col sm:flex-row gap-2">
                  <button
                    className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500 transition"
                    onClick={() => onEdit(acc)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                    onClick={() => openDeleteModal(acc.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

     
      <div className="sm:hidden flex flex-col gap-4 mt-4">
        {paginatedAccommodations.map((acc, index) => (
          <div key={acc.id} className="bg-white p-4 rounded shadow flex flex-col gap-2">
            <div>
              <span className="font-semibold">#{(page - 1) * ITEMS_PER_PAGE + index + 1}</span> -{" "}
              <span className="font-medium">{acc.type}</span>
            </div>
            <div><span className="font-semibold">Price:</span> ${acc.price}</div>
            {acc.imageUrl ? (
              <img
                src={acc.imageUrl}
                alt={acc.type}
                loading="lazy"
                className="w-24 h-24 object-cover rounded mt-2"
                onError={(e) => e.target.src = "/placeholder.png"}
              />
            ) : (
              <span className="text-gray-400 text-xs">No Image</span>
            )}
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                onClick={() => onEdit(acc)}
              >
                Edit
              </button>
              <button
                className="flex-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => openDeleteModal(acc.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

    
      <div className="flex justify-center items-center gap-4 pt-4">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm font-medium text-gray-700">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

     
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this accommodation?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AccommodationTable;
