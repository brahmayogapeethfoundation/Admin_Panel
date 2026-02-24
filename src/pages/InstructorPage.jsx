import React, { useEffect, useRef, useState } from "react";
import InstructorForm from "../components/InstructorForm";
import InstructorTable from "../components/InstructorTable";
import toast, { Toaster } from "react-hot-toast";
import {
  getInstructors,
  createInstructor,
  updateInstructor,
  deleteInstructor,
  getCourses,
} from "../api/api";
import Loader from "../components/Loader"; 

const ITEMS_PER_PAGE = 5;

const InstructorPage = () => {
  const [instructors, setInstructors] = useState([]);
  const [courses, setCourses] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true); 
  const formRef = useRef(null);


  const fetchInstructors = async () => {
    try {
      setLoading(true); 
      const data = await getInstructors();
      setInstructors(data || []);
    } catch {
      // toast.error("Failed to fetch instructors");
    } finally {
      setLoading(false); 
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data || []);
    } catch {
      // toast.error("Failed to fetch courses");
    }
  };

  useEffect(() => {
    fetchInstructors();
    fetchCourses();
  }, []);


  const handleAddOrUpdate = async (data) => {
    try {
      setLoading(true); // ✅ show loader while saving
      if (editing) {
        await updateInstructor(editing.id, data);
        toast.success("Instructor updated successfully");
        setEditing(null);
      } else {
        await createInstructor(data);
        toast.success("Instructor added successfully");

        // Jump to last page
        const totalItems = instructors.length + 1;
        const lastPage = Math.ceil(totalItems / ITEMS_PER_PAGE);
        setCurrentPage(lastPage);
      }
      setFormOpen(false);
      await fetchInstructors();
      await fetchCourses();
    } catch {
      toast.error("Operation failed");
    } finally {
      setLoading(false); 
    }
  };


  const handleEdit = (inst) => {
    setEditing(inst);
    setFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };


  const handleDelete = async (id) => {
    const isUsed = courses.some((c) => c.instructorId === id);
    if (isUsed) {
      toast.error("This instructor is assigned to a course and cannot be deleted.");
      return;
    }

    try {
      setLoading(true); 
      await deleteInstructor(id);
      toast.success("Instructor deleted successfully");

   
      const totalItems = instructors.length - 1;
      const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
      setCurrentPage((prev) => Math.min(prev, totalPages));

      await fetchInstructors();
      await fetchCourses();
    } catch {
      toast.error("Failed to delete instructor");
    } finally {
      setLoading(false); // ✅ hide loader
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="flex-1 p-4 md:p-6 bg-gray-100">
        <Toaster position="top-right" />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Instructors Dashboard
          </h1>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            onClick={() => {
              setFormOpen(!formOpen);
              setEditing(null);
              setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: "smooth" });
              }, 100);
            }}
          >
            {formOpen ? "Close Form" : "Add Instructor"}
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
                <InstructorForm
                  onSubmit={handleAddOrUpdate}
                  initialData={editing}
                />
              </div>
            )}

            {/* Table */}
            <InstructorTable
              instructors={instructors}
              courses={courses}
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

export default InstructorPage;
