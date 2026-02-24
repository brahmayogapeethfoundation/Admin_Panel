import React, { useEffect, useRef, useState } from "react";
import AccommodationForm from "../components/AccommodationForm";
import AccommodationTable from "../components/AccommodationTable";
import Loader from "../components/Loader";
import {
  getAccommodations,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation,
} from "../api/api";
import toast, { Toaster } from "react-hot-toast";

const AccommodationPage = () => {
  const [accommodations, setAccommodations] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);

 
  const fetchAccommodations = async () => {
    try {
      setLoading(true);
      const data = await getAccommodations();
      setAccommodations(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccommodations();
  }, []);

  
  const handleAddOrUpdate = async (formData) => {
    try {
      setLoading(true);

      if (editing) {
        await updateAccommodation(editing.id, formData);
        toast.success("Accommodation updated successfully");
        setEditing(null);
      } else {
        await createAccommodation(formData);
        toast.success("Accommodation added successfully");
      }

      setFormOpen(false);
      await fetchAccommodations();
    } catch (err) {
      toast.error("Operation failed");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (acc) => {
    setEditing(acc);
    setFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteAccommodation(id);
      toast.success("Accommodation deleted successfully");
      await fetchAccommodations();
    } catch (err) {
      toast.error("Failed to delete accommodation");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex-1 p-4 md:p-6 bg-gray-100">
        <Toaster position="top-right" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Accommodations Dashboard
          </h1>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => {
              setFormOpen(!formOpen);
              setEditing(null);
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            {formOpen ? "Close Form" : "Add Accommodation"}
          </button>
        </div>

        {/* Form */}
        {formOpen && (
          <div ref={formRef} className="mb-6">
            <AccommodationForm
              onSubmit={handleAddOrUpdate}
              initialData={editing}
              loading={loading}
            />
          </div>
        )}

      
        {loading ? (
          <Loader />
        ) : (
          <AccommodationTable
            accommodations={accommodations}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
};

export default AccommodationPage;
