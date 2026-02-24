import React, { useState, useEffect, useMemo } from "react";

const ITEMS_PER_PAGE = 5;

const TableRow = React.memo(({ instructor, index, page, onEdit, openDeleteModal }) => (
  <tr className="hover:bg-gray-100 transition">
    <td className="p-2 sm:p-3 border">{(page - 1) * ITEMS_PER_PAGE + index + 1}</td>
    <td className="p-2 sm:p-3 border">{instructor.name}</td>
    <td className="p-2 sm:p-3 border">{instructor.role}</td>
    <td className="p-2 sm:p-3 border">{instructor.description}</td>
    <td className="p-2 sm:p-3 border">
      {instructor.imageUrl ? (
        <img
          src={instructor.imageUrl}
          alt={instructor.name}
          loading="lazy" 
          className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded shadow"
        />
      ) : (
        <span className="text-gray-400 text-xs sm:text-sm">No Photo</span>
      )}
    </td>
    <td className="p-2 sm:p-3 border flex flex-col sm:flex-row gap-2">
      <button
        className="bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500 transition"
        onClick={() => onEdit(instructor)}
      >
        Edit
      </button>
      <button
        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
        onClick={() => openDeleteModal(instructor.id)}
      >
        Delete
      </button>
    </td>
  </tr>
));

const InstructorTable = ({
  instructors = [],
  courses = [],
  onEdit,
  onDelete,
  currentPage,
  setCurrentPage,
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [cannotDeleteMessage, setCannotDeleteMessage] = useState("");

  const [localInstructors, setLocalInstructors] = useState([]);

  // Sync local data without resetting page unnecessarily
  useEffect(() => {
    setLocalInstructors(Array.isArray(instructors) ? instructors : []);
  }, [instructors]);

  const totalPages = Math.max(1, Math.ceil(localInstructors.length / ITEMS_PER_PAGE));

  const paginatedInstructors = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return localInstructors.slice(start, start + ITEMS_PER_PAGE);
  }, [localInstructors, currentPage]);

  const openDeleteModal = (id) => {
    const instructorUsed = courses.some((c) => c.instructorId === id);
    if (instructorUsed) {
      setCannotDeleteMessage("This instructor is assigned to a course and cannot be deleted.");
      setDeleteId(null);
    } else {
      setDeleteId(id);
      setCannotDeleteMessage("");
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteId !== null) {
      // Update local state immediately for smooth UI
      setLocalInstructors((prev) => prev.filter((i) => i.id !== deleteId));
      onDelete(deleteId);
      // Adjust page if deleting last item on last page
      if ((paginatedInstructors.length === 1) && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
    setShowDeleteModal(false);
    setDeleteId(null);
    setCannotDeleteMessage("");
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
    setCannotDeleteMessage("");
  };

  return (
    <>
     
      <div className="hidden sm:block overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border-collapse text-sm sm:text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 sm:p-3 text-left border">#</th>
              <th className="p-2 sm:p-3 text-left border">Name</th>
              <th className="p-2 sm:p-3 text-left border">Role</th>
              <th className="p-2 sm:p-3 text-left border">Bio</th>
              <th className="p-2 sm:p-3 text-left border">Photo</th>
              <th className="p-2 sm:p-3 text-left border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedInstructors.map((i, index) => (
              <TableRow
                key={i.id}
                instructor={i}
                index={index}
                page={currentPage}
                onEdit={onEdit}
                openDeleteModal={openDeleteModal}
              />
            ))}
          </tbody>
        </table>
      </div>

  
      <div className="sm:hidden flex flex-col gap-4 mt-4">
        {paginatedInstructors.map((i, index) => (
          <div key={i.id} className="bg-white p-4 rounded shadow flex flex-col gap-2">
            <div>
              <span className="font-semibold">#{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}</span> -{" "}
              <span className="font-medium">{i.name}</span>
            </div>
            <div><span className="font-semibold">Role:</span> {i.role}</div>
            <div><span className="font-semibold">Bio:</span> {i.description}</div>
            {i.imageUrl && (
              <img
                src={i.imageUrl}
                alt={i.name}
                loading="lazy"
                className="w-24 h-24 object-cover rounded mt-2"
              />
            )}
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 bg-yellow-400 px-2 py-1 rounded hover:bg-yellow-500"
                onClick={() => onEdit(i)}
              >
                Edit
              </button>
              <button
                className="flex-1 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() => openDeleteModal(i.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      
      <div className="flex justify-center items-center gap-4 mt-4">
        <button
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Prev
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white p-6 rounded shadow-lg w-full max-w-sm">
            {cannotDeleteMessage ? (
              <>
                <h2 className="text-xl font-semibold mb-4">Cannot Delete</h2>
                <p className="mb-6">{cannotDeleteMessage}</p>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    onClick={cancelDelete}
                  >
                    OK
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
                <p className="mb-6">Are you sure you want to delete this instructor?</p>
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorTable;
