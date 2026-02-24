import React, { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 5;


const GalleryRow = React.memo(({ item, index, currentPage, onEdit, openModal }) => (
  <tr className="hover:bg-gray-100 transition">
    <td className="p-3 border">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</td>
    <td className="p-3 border">
      {item.imageUrl ? (
        <img
          src={item.imageUrl}
          alt={item.category}
          loading="lazy" 
          className="w-20 h-20 object-cover rounded shadow"
        />
      ) : (
        <span className="text-gray-400">No Image</span>
      )}
    </td>
    <td className="p-3 border">{item.category}</td>
    <td className="p-3 border flex gap-2">
      <button
        className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500 transition"
        onClick={() => onEdit(item)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
        onClick={() => openModal(item.id)}
      >
        Delete
      </button>
    </td>
  </tr>
));

const GalleryTable = ({ gallery = [], onEdit, onDelete, currentPage, setCurrentPage }) => {
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const [localGallery, setLocalGallery] = useState(gallery);

  React.useEffect(() => {
    setLocalGallery(Array.isArray(gallery) ? gallery : []);
  }, [gallery]);

  const totalPages = Math.max(1, Math.ceil(localGallery.length / ITEMS_PER_PAGE));

  const paginatedGallery = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return localGallery.slice(start, start + ITEMS_PER_PAGE);
  }, [localGallery, currentPage]);

  const openModal = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      setLocalGallery((prev) => prev.filter((item) => item.id !== deleteId));
      onDelete(deleteId);
      // Adjust page if deleting last item on last page
      if (paginatedGallery.length === 1 && currentPage > 1) {
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
      {/* Desktop Table */}
      <div className="hidden sm:block overflow-x-auto bg-white rounded shadow mt-4">
        <table className="min-w-full border-collapse text-sm sm:text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 border text-left">#</th>
              <th className="p-3 border text-left">Image</th>
              <th className="p-3 border text-left">Category</th>
              <th className="p-3 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedGallery.map((item, index) => (
              <GalleryRow
                key={item.id}
                item={item}
                index={index}
                currentPage={currentPage}
                onEdit={onEdit}
                openModal={openModal}
              />
            ))}
          </tbody>
        </table>
      </div>


      <div className="sm:hidden flex flex-col gap-4 mt-4">
        {paginatedGallery.map((item, index) => (
          <div key={item.id} className="bg-white p-4 rounded shadow flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span>
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.category}
                  loading="lazy"
                  className="w-16 h-16 object-cover rounded shadow"
                />
              ) : (
                <span className="text-gray-400 text-xs">No Image</span>
              )}
            </div>
            <div><span className="font-semibold">Category: </span>{item.category}</div>
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500 transition"
                onClick={() => onEdit(item)}
              >
                Edit
              </button>
              <button
                className="flex-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                onClick={() => openModal(item.id)}
              >
                Delete
              </button>
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
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this image?</p>
            <div className="flex justify-end gap-4">
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
    </div>
  );
};

export default GalleryTable;
