import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import GalleryForm from "../components/GalleryForm";
import GalleryTable from "../components/GalleryTable";
import Loader from "../components/Loader"; 
import {
  getGallery,
  createGallery,
  updateGallery,
  deleteGallery,
} from "../api/api";

const ITEMS_PER_PAGE = 5;

const GalleryPage = () => {
  const [gallery, setGallery] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); // ✅ loader state
  const formRef = useRef(null);


  const fetchGallery = async () => {
    try {
      setLoading(true); 
      const data = await getGallery();
      setGallery(data || []);
    } catch {
      console.log(error)
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);


  const handleAddOrUpdate = async (data) => {
    try {
      setLoading(true); // ✅ show loader while saving
      if (editing) {
        await updateGallery(editing.id, data);
        toast.success("Gallery updated successfully!");
        setEditing(null);
      } else {
        await createGallery(data);
        toast.success("Gallery added successfully!");

        // Go to last page after adding
        const totalItems = gallery.length + 1;
        const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
        setCurrentPage(lastPage);
      }
      setShowForm(false);
      await fetchGallery(); // refresh after add/update
    } catch {
      toast.error("Operation failed");
    } finally {
      setLoading(false); // ✅ hide loader
    }
  };


  const handleEdit = (item) => {
    setEditing(item);
    setShowForm(true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };


  const handleDelete = async (id) => {
    try {
      setLoading(true); 
      await deleteGallery(id);
      toast.success("Gallery deleted successfully!");

      // Stay on same page if possible
      const totalItems = gallery.length - 1;
      const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
      setCurrentPage((prev) => Math.min(prev, totalPages));

      await fetchGallery();
    } catch {
      toast.error("Delete failed");
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <div className="flex-1 p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
          <h1 className="text-2xl font-bold text-gray-800">Gallery Dashboard</h1>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditing(null);
              setTimeout(() => {
                formRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "start",
                });
              }, 100);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            {showForm ? "Close Form" : "Add Gallery"}
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        ) : (
          <>
         
            {showForm && (
              <div ref={formRef} className="mb-6">
                <GalleryForm onSubmit={handleAddOrUpdate} initialData={editing} />
              </div>
            )}

          
            <GalleryTable
              gallery={gallery}
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

export default GalleryPage;
