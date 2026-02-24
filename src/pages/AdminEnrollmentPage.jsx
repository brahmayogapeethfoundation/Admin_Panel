
import React, { useState, useEffect, useRef } from "react";
import EnrollmentFormCard from "../components/EnrollmentForm";
import EnrollmentCards from "../components/EnrollmentCards";
import {
  getEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  getCourses,
  getAccommodations,
} from "../api/api";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../components/Loader";

const AdminEnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [editing, setEditing] = useState(null);
  const [courses, setCourses] = useState([]);
  const [accommodations, setAccommodations] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [initialLoading, setInitialLoading] = useState(true); // page load
  const [actionLoading, setActionLoading] = useState(false); // submit/delete

  const formRef = useRef(null);

 
  const fetchEnrollments = async () => {
    try {
      const data = await getEnrollments();
      setEnrollments(data || []);
    } catch {
      toast.error("Failed to fetch enrollments");
    }
  };

  const fetchCourses = async () => {
    try {
      const data = await getCourses(false);
      setCourses(data || []);
    } catch {
      toast.error("Failed to fetch courses");
    }
  };

  const fetchAccommodations = async () => {
    try {
      const data = await getAccommodations();
      setAccommodations(data || []);
    } catch {
      toast.error("Failed to fetch accommodations");
    }
  };

  useEffect(() => {
    const init = async () => {
      setInitialLoading(true);
      await Promise.all([
        fetchEnrollments(),
        fetchCourses(),
        fetchAccommodations(),
      ]);
      setInitialLoading(false);
    };
    init();
  }, []);

  
  const handleAddOrUpdate = async (data) => {
    try {
      setActionLoading(true);

      if (editing) {
        await updateEnrollment(editing.id, data);
        toast.success("Enrollment updated");
      } else {
        await createEnrollment(data);
        toast.success("Enrollment added");
      }

      setShowForm(false);
      setEditing(null);
      fetchEnrollments();
    } catch {
      toast.error("Operation failed");
    } finally {
      setActionLoading(false);
    }
  };


  const handleEdit = (enrollment) => {
    setEditing(enrollment);
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
      setActionLoading(true);
      await deleteEnrollment(id);
      setEnrollments((prev) => prev.filter((e) => e.id !== id));
      toast.success("Enrollment deleted");
    } catch {
      toast.error("Delete failed");
    } finally {
      setActionLoading(false);
    }
  };


  const handleMarkAsPaid = async (id) => {
    const enrollment = enrollments.find((e) => e.id === id);
    if (!enrollment) return;

    try {
      setActionLoading(true);
      await updateEnrollment(id, {
        ...enrollment,
        paymentStatus: "PAID",
        paymentMode: "ONLINE",
      });

      setEnrollments((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, paymentStatus: "PAID", paymentMode: "ONLINE" }
            : e
        )
      );

      toast.success("Marked as Paid");
    } catch {
      toast.error("Failed to update payment");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 relative">
      <Toaster position="top-right" />

    
      <div className="flex flex-col md:flex-row justify-between gap-3 mb-4">
        <h1 className="text-2xl md:text-3xl font-bold">
          Enrollments Dashboard
        </h1>

        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Enrollment
        </button>
      </div>

     
      {showForm && (
        <div
          ref={formRef}
          className="relative z-50 mb-6 bg-white rounded shadow border"
        >
          <EnrollmentFormCard
            onSubmit={handleAddOrUpdate}
            initialData={editing}
            courses={courses}
            accommodations={accommodations}
            onClose={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        </div>
      )}

      {initialLoading ? (
        <div className="flex items-center justify-center h-[60vh]">
          <Loader />
        </div>
      ) : (
        <EnrollmentCards
          enrollments={enrollments}
          allCourses={courses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onUpdatePaymentStatus={handleMarkAsPaid}
        />
      )}

   
      {actionLoading && (
        <div className="fixed inset-0 bg-black/30 z-[999] flex items-center justify-center">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default AdminEnrollmentsPage;
