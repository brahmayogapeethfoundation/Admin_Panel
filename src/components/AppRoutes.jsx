const AppRoutes = () => {
  const navigate = useNavigate();

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
       
        <Route path="/login" element={<AdminLogin />} />

        
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

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </>
  );
};




export default AppRoutes