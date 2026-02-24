
import React, { useEffect, useRef, useState } from "react";
import CourseForm from "../components/CourseForm";
import CourseTable from "../components/CourseTable";
import {
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  toggleCourseVisibility,
} from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader"; 

const CoursePage = () => {
  const [courses, setCourses] = useState([]);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ loader state
  const formRef = useRef(null);

  const [courseToDelete, setCourseToDelete] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);


  const loadCourses = async () => {
    setLoading(true); 
    try {
      const data = await getCourses();
      setCourses(Array.isArray(data) ? data : []);
    } catch {
      // toast.error("Failed to load courses");
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  
  const handleSubmit = async (payload, mainImage, galleryImages) => {
    try {
      setLoading(true);
      if (editingCourse) {
        const updated = await updateCourse(
          editingCourse.id,
          payload,
          mainImage,
          galleryImages
        );

        setCourses((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );

        toast.success("Course updated");
      } else {
        const created = await createCourse(payload, mainImage, galleryImages);
        setCourses((prev) => [...prev, created]);
        toast.success("Course created");
      }

      setEditingCourse(null);
      setFormOpen(false);

      setTimeout(() => {
        document
          .getElementById("course-table")
          ?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch {
      toast.error("Operation failed");
    } finally {
      setLoading(false); // hide loader
    }
  };

 
  const handleToggleVisibility = async (id) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isVisible: !c.isVisible } : c))
    );

    try {
      const updated = await toggleCourseVisibility(id);
      setCourses((prev) =>
        prev.map((c) => (c.id === updated.id ? updated : c))
      );
      toast.success("Visibility updated");
    } catch {
      setCourses((prev) =>
        prev.map((c) => (c.id === id ? { ...c, isVisible: !c.isVisible } : c))
      );
      toast.error("Visibility update failed");
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormOpen(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };


  const confirmDelete = async () => {
    try {
      setLoading(true); // show loader while deleting
      await deleteCourse(courseToDelete);
      setCourses((prev) => prev.filter((c) => c.id !== courseToDelete));
      toast.success("Course deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setShowDeleteModal(false);
      setCourseToDelete(null);
      setLoading(false); // hide loader
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Toaster position="top-right" />

      
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
        <h1 className="text-2xl font-bold">Courses Dashboard</h1>

        <button
          onClick={() => {
            setFormOpen((p) => !p);
            setEditingCourse(null);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {formOpen ? "Close Form" : "Add Course"}
        </button>
      </div>

      
      {formOpen && (
        <div ref={formRef} className="mb-6">
          <CourseForm onSubmit={handleSubmit} initialData={editingCourse} />
        </div>
      )}

    
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader />
        </div>
      ) : (
        
        <div id="course-table">
          <CourseTable
            courses={courses}
            onEdit={handleEdit}
            onDelete={(id) => {
              setCourseToDelete(id);
              setShowDeleteModal(true);
            }}
            onToggleVisibility={handleToggleVisibility}
          />
        </div>
      )}

      {/* DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-80">
            <p className="mb-4">Delete this course?</p>
            <div className="flex justify-between">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-1 rounded"
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

export default CoursePage;
