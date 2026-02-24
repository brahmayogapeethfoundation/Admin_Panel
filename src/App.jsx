import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";

import AdminLogin from "./pages/AdminLogin";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import AdminEnrollmentsPage from "./pages/AdminEnrollmentPage";
import AdminEnquiriesPage from "./pages/AdminEnquiriesPage";
import AccommodationsPage from "./pages/AccommodationPage";
import InstructorPage from "./pages/InstructorPage";
import TestimonialsPage from "./pages/TestimonialsPage";
import GalleryPage from "./pages/GalleryPage";

import PrivateRoute from "./components/PrivateRoute";
import AdminLayout from "./layouts/AdminLayout";

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

const AppContent = () => {
  const navigate = useNavigate();

  // 🔥 Listen for logout from other tabs
  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === "logout") {
        navigate("/login", { replace: true });
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [navigate]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* PUBLIC */}
        <Route path="/login" element={<AdminLogin />} />

        {/* PROTECTED */}
        <Route element={<PrivateRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/enrollments" element={<AdminEnrollmentsPage />} />
            <Route path="/accommodations" element={<AccommodationsPage />} />
            <Route path="/instructors" element={<InstructorPage />} />
            <Route path="/enquiries" element={<AdminEnquiriesPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/gallery" element={<GalleryPage />} />
          </Route>
        </Route>

        {/* DEFAULT */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};

export default App;
