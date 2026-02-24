import React, { useState, useEffect } from "react";

import EnquiryTable from "../components/EnquiryTable";
import Loader from "../components/Loader"; // ✅ ADD THIS
import {
  getEnquiries,
  deleteEnquiry,
  updateEnquiryStatus,
} from "../api/api";

const AdminEnquiriesPage = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true); // ✅ start true


  const fetchEnquiries = async () => {
    try {
      setLoading(true); // ✅ start loader
      const data = await getEnquiries();
      setEnquiries(data || []);
      return data; // optional for table refresh
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setLoading(false); // ✅ stop loader
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  
  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await deleteEnquiry(id);
      await fetchEnquiries();
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

 
  const handleStatusChange = async (id, status) => {
    try {
      await updateEnquiryStatus(id, status);

      // instant UI update
      setEnquiries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status } : e))
      );
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  return (
    <div className="flex">
      
      <div className="flex-1 p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Enquiries Dashboard</h1>

        {/* ✅ LOADER */}
        {loading ? (
          <Loader />
        ) : (
          <EnquiryTable
            enquiries={enquiries}
            onDelete={handleDelete}
            onStatusChange={handleStatusChange}
            fetchEnquiries={fetchEnquiries}
          />
        )}
      </div>
    </div>
  );
};

export default AdminEnquiriesPage;
