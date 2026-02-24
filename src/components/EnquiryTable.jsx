import React, { useState, useMemo, useEffect } from "react";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const ITEMS_PER_PAGE = 5;

const EnquiryTable = ({ enquiries = [], onDelete, onStatusChange }) => {
  const [localEnquiries, setLocalEnquiries] = useState([]);
  const [page, setPage] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);

  useEffect(() => {
    setLocalEnquiries(Array.isArray(enquiries) ? enquiries : []);
    setPage(1);
  }, [enquiries]);

  const filteredEnquiries = useMemo(() => {
    return [...localEnquiries].sort(
      (a, b) => dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf()
    );
  }, [localEnquiries]);

  const totalPages = Math.max(1, Math.ceil(filteredEnquiries.length / ITEMS_PER_PAGE));
  const paginatedEnquiries = useMemo(() => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredEnquiries.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredEnquiries, page]);

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await onDelete(deleteId);
      toast.success("Enquiry deleted successfully");
      setLocalEnquiries((prev) => prev.filter((e) => e.id !== deleteId));
      // Adjust page if needed
      const newTotalPages = Math.max(1, Math.ceil((localEnquiries.length - 1) / ITEMS_PER_PAGE));
      if (page > newTotalPages) setPage(newTotalPages);
    } catch {
      toast.error("Failed to delete enquiry");
    } finally {
      setShowDeleteModal(false);
      setDeleteId(null);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await onStatusChange(id, status);
      setLocalEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const openMessageModal = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setShowMessageModal(true);
  };
  const closeMessageModal = () => {
    setSelectedEnquiry(null);
    setShowMessageModal(false);
  };

  return (
    <>
      <div className="hidden sm:block overflow-x-auto bg-white rounded shadow">
        <table className="min-w-full border-collapse text-sm sm:text-base">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 sm:p-3 border text-left">#</th>
              <th className="p-2 sm:p-3 border text-left">Name</th>
              <th className="p-2 sm:p-3 border text-left">Email</th>
              <th className="p-2 sm:p-3 border text-left">Phone</th>
              <th className="p-2 sm:p-3 border text-left">Message</th>
              <th className="p-2 sm:p-3 border text-left">Status</th>
              <th className="p-2 sm:p-3 border text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEnquiries.map((e, idx) => (
              <tr key={e.id} className="hover:bg-gray-100 transition">
                <td className="p-2 sm:p-3 border">{(page - 1) * ITEMS_PER_PAGE + idx + 1}</td>
                <td className="p-2 sm:p-3 border">{e.name}</td>
                <td className="p-2 sm:p-3 border">{e.email}</td>
                <td className="p-2 sm:p-3 border">{e.phone}</td>
                <td className="p-2 sm:p-3 border">
                  <button
                    onClick={() => openMessageModal(e)}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View
                  </button>
                </td>
                <td className="p-2 sm:p-3 border">
                  <select
                    value={e.status}
                    onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </td>
                <td className="p-2 sm:p-3 border flex flex-col sm:flex-row gap-2">
                  <button
                    onClick={() => openDeleteModal(e.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {paginatedEnquiries.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center p-4 text-gray-500">
                  No enquiries found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden flex flex-col gap-4 mt-4">
        {paginatedEnquiries.map((e, idx) => (
          <div key={e.id} className="bg-white p-4 rounded shadow flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <span className="font-semibold">
                #{(page - 1) * ITEMS_PER_PAGE + idx + 1} • {e.name}
              </span>
              <button
                onClick={() => openDeleteModal(e.id)}
                className="bg-red-500 text-white px-2 py-1 rounded text-sm"
              >
                Delete
              </button>
            </div>
            <div><span className="font-semibold">Email:</span> {e.email}</div>
            <div><span className="font-semibold">Phone:</span> {e.phone}</div>
            <div>
              <span className="font-semibold">Message:</span>{" "}
              <button
                onClick={() => openMessageModal(e)}
                className="text-blue-600 hover:underline text-sm"
              >
                View
              </button>
            </div>
            <div>
              <span className="font-semibold">Status:</span>{" "}
              <select
                value={e.status}
                onChange={(ev) => handleStatusChange(e.id, ev.target.value)}
                className="border rounded px-2 py-1 text-sm w-full mt-1"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="RESOLVED">Resolved</option>
              </select>
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

      {showMessageModal && selectedEnquiry && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white p-4 rounded shadow max-w-md w-full">
            <h2 className="font-semibold text-lg mb-2">Enquiry Message</h2>
            <p className="text-sm text-gray-500 mb-2">
              {selectedEnquiry.name} • {selectedEnquiry.email}
            </p>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{selectedEnquiry.message}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={closeMessageModal}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="bg-white p-6 rounded shadow max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-3">Confirm Delete</h2>
            <p className="mb-4 text-sm">Are you sure you want to delete this enquiry?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
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

export default EnquiryTable;
