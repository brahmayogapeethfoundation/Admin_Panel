import React, { useState, useMemo } from "react";

const ITEMS_PER_PAGE = 6;

const EnrollmentCards = ({
  enrollments = [],
  allCourses = [],
  onEdit,
  onDelete,
  onUpdatePaymentStatus,
}) => {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCourse, setFilterCourse] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [todayFilter, setTodayFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [confirmMarkPaidId, setConfirmMarkPaidId] = useState(null);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const courseOptions = useMemo(() => allCourses || [], [allCourses]);

  const filteredEnrollments = useMemo(() => {
    return [...enrollments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((e) => {
        const matchesSearch =
          e.fullName?.toLowerCase().includes(search.toLowerCase()) ||
          e.email?.toLowerCase().includes(search.toLowerCase()) ||
          e.phone?.toLowerCase().includes(search.toLowerCase());

        const matchesStatus = filterStatus ? e.paymentStatus === filterStatus : true;
        const matchesCourse = filterCourse ? e.courseTitle === filterCourse : true;

        const enrollmentDate = e.createdAt ? new Date(e.createdAt) : null;

        let matchesRange = true;
        if (dateRange.from && dateRange.to && enrollmentDate) {
          const from = new Date(dateRange.from);
          const to = new Date(dateRange.to);
          to.setHours(23, 59, 59, 999);
          matchesRange = enrollmentDate >= from && enrollmentDate <= to;
        }

        let matchesToday = true;
        if (todayFilter && enrollmentDate) {
          const today = new Date();
          matchesToday =
            enrollmentDate.getFullYear() === today.getFullYear() &&
            enrollmentDate.getMonth() === today.getMonth() &&
            enrollmentDate.getDate() === today.getDate();
        }

        return matchesSearch && matchesStatus && matchesCourse && matchesRange && matchesToday;
      });
  }, [enrollments, search, filterStatus, filterCourse, dateRange, todayFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredEnrollments.length / ITEMS_PER_PAGE));
  const paginatedEnrollments = filteredEnrollments.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("");
    setFilterCourse("");
    setDateRange({ from: "", to: "" });
    setTodayFilter(false);
    setCurrentPage(1);
  };

  const FiltersPanel = (
    <div className="flex flex-col md:flex-row gap-2 flex-wrap p-4 bg-white shadow rounded">
      <input
        type="text"
        placeholder="Search name, email, phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full md:w-1/5"
      />

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="border p-2 rounded w-full md:w-1/6"
      >
        <option value="">All Status</option>
        <option value="PAID">PAID</option>
        <option value="PENDING">PENDING</option>
      </select>

      <select
        value={filterCourse}
        onChange={(e) => setFilterCourse(e.target.value)}
        className="border p-2 rounded w-full md:w-1/4"
      >
        <option value="">All Courses</option>
        {courseOptions.map((c) => (
          <option key={c.id} value={c.title}>
            {c.title}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={dateRange.from}
        onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
        className="border p-2 rounded w-full md:w-1/6"
      />
      <input
        type="date"
        value={dateRange.to}
        onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
        className="border p-2 rounded w-full md:w-1/6"
      />

      <button
        onClick={() => setTodayFilter((prev) => !prev)}
        className={`px-3 py-1 rounded w-full sm:w-auto ${
          todayFilter ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
        }`}
      >
        Today
      </button>

      <button
        onClick={resetFilters}
        className="bg-gray-300 px-3 py-1 rounded w-full sm:w-auto"
      >
        Reset
      </button>
    </div>
  );

  return (
    <div className="space-y-4">

      <div className="md:hidden flex justify-end">
        <button
          onClick={() => setShowFilterDrawer(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Filters
        </button>
      </div>

      <div className="hidden md:block">{FiltersPanel}</div>

      {showFilterDrawer && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={() => setShowFilterDrawer(false)}
          ></div>

          <div className="relative w-72 bg-white h-full shadow-lg p-4 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <button
                onClick={() => setShowFilterDrawer(false)}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ✕
              </button>
            </div>
            {FiltersPanel}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedEnrollments.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No enrollments found
          </div>
        ) : (
          paginatedEnrollments.map((e) => {
            const enrollmentDate = e.createdAt ? new Date(e.createdAt) : null;

            const highlightToday =
              todayFilter && enrollmentDate?.toDateString() === new Date().toDateString();
            const highlightRange =
              dateRange.from && dateRange.to &&
              enrollmentDate >= new Date(dateRange.from) &&
              enrollmentDate <= new Date(new Date(dateRange.to).setHours(23, 59, 59, 999));

            const highlight = highlightToday || highlightRange;

            return (
              <div
                key={e.id}
                className={`bg-white p-4 rounded shadow flex flex-col justify-between ${
                  highlight ? "border-2 border-blue-500" : ""
                }`}
              >
                <div>
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-lg">{e.fullName}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        e.paymentStatus === "PAID"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {e.paymentStatus}
                    </span>
                  </div>

                  <div className="text-sm mt-2 space-y-1">
                    <div><strong>Email:</strong> {e.email}</div>
                    <div><strong>Phone:</strong> {e.phone}</div>
                    <div><strong>Country:</strong> {e.country}</div>
                    <div>
                      <strong>Course:</strong> {e.courseTitle} • <strong>Duration:</strong> {e.duration || "N/A"}
                    </div>
                    <div>Fee: ₹{e.coursePrice}</div>
                    <div>
                      <strong>Accommodation:</strong>{" "}
                      {e.accommodationType ? `${e.accommodationType} - ₹${e.accommodationPricePerDay}/day` : "None"}
                    </div>
                    <div className="mt-2 font-bold">Total: ₹{e.totalPrice}</div>
                    <div>Payment Mode: {e.paymentMode}</div>
                    <div>Enrolled On: {e.createdAt ? new Date(e.createdAt).toLocaleString() : "-"}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2 mt-2">
                  <button onClick={() => onEdit(e)} className="bg-yellow-400 text-white px-3 py-1 rounded w-full sm:w-auto">
                    Edit
                  </button>
                  <button onClick={() => setConfirmDeleteId(e.id)} className="bg-red-500 text-white px-3 py-1 rounded w-full sm:w-auto">
                    Delete
                  </button>
                  {e.paymentStatus === "PENDING" && (
                    <button
                      onClick={() => setConfirmMarkPaidId(e.id)}
                      className="bg-green-600 text-white px-3 py-1 rounded w-full sm:w-auto"
                    >
                      Mark Paid
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex justify-center gap-4 mt-4 flex-wrap">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>
        <span className="mt-1">Page {currentPage} of {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {confirmDeleteId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
            <p className="mb-6">Are you sure you want to delete this enrollment?</p>
            <div className="flex justify-end gap-2 flex-wrap">
              <button onClick={() => setConfirmDeleteId(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={async () => { await onDelete(confirmDeleteId); setConfirmDeleteId(null); }} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Delete</button>
            </div>
          </div>
        </div>
      )}

      {confirmMarkPaidId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Confirm Payment</h2>
            <p className="mb-6">Mark this enrollment as Paid?</p>
            <div className="flex justify-end gap-2 flex-wrap">
              <button onClick={() => setConfirmMarkPaidId(null)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Cancel</button>
              <button onClick={async () => { await onUpdatePaymentStatus(confirmMarkPaidId); setConfirmMarkPaidId(null); }} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentCards;
