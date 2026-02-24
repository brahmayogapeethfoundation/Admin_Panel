import React, { useEffect, useMemo, useState, useRef } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";

const ITEMS_PER_PAGE = 5;

const CourseTable = ({ courses = [], onEdit, onDelete, onToggleVisibility }) => {
  const [expandedRows, setExpandedRows] = useState({});
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [localCourses, setLocalCourses] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const firstLoad = useRef(true);
  const prevLength = useRef(0);

  useEffect(() => {
    const arr = Array.isArray(courses) ? courses : [];
    setLocalCourses(arr);

    const totalPages = Math.max(1, Math.ceil(arr.length / ITEMS_PER_PAGE));

    if (firstLoad.current) {
      setPage(1); 
      firstLoad.current = false;
    } else if (arr.length > prevLength.current) {
      setPage(totalPages); // add → last page
    } else {
      setPage((p) => Math.min(p, totalPages)); // update/delete → same page
    }

    prevLength.current = arr.length;
  }, [courses]);

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };


  const filteredCourses = useMemo(() => {
    return localCourses.filter(
      (c) =>
        (c.title || "").toLowerCase().includes(search.toLowerCase()) ||
        (c.category || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [localCourses, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCourses.length / ITEMS_PER_PAGE)
  );

  const paginatedCourses = filteredCourses.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );


  const handleToggleVisibility = async (id) => {
    if (!onToggleVisibility) return;

    setLoadingId(id);
    setLocalCourses((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, isVisible: !c.isVisible } : c
      )
    );

    try {
      await onToggleVisibility(id);
    } catch {
      setLocalCourses((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, isVisible: !c.isVisible } : c
        )
      );
      alert("Failed to update visibility");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by title or category..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border p-2 rounded w-full"
      />


      <div className="overflow-x-auto bg-white rounded shadow hidden md:block">
        {paginatedCourses.length === 0 ? (
          <div className="text-center p-6 text-gray-500">No courses found.</div>
        ) : (
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">#</th>
                <th className="p-2 border">Title</th>
                <th className="p-2 border">Category</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Instructor</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedCourses.map((course, idx) => (
                <React.Fragment key={course.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="p-2 border text-center">
                      {(page - 1) * ITEMS_PER_PAGE + idx + 1}
                    </td>
                    <td className="p-2 border">{course.title}</td>
                    <td className="p-2 border max-w-[200px] truncate">{course.category}</td>
                    <td className="p-2 border">₹{course.price}</td>
                    <td className="p-2 border">{course.instructor?.name || "-"}</td>
                    <td className="p-2 border text-center">
                      <button
                        disabled={loadingId === course.id}
                        onClick={() => handleToggleVisibility(course.id)}
                        className={`px-3 py-1 rounded text-white text-sm ${
                          course.isVisible ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {course.isVisible ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className=" flex p-2 border">
                      <div className="flex justify-center items-center gap-2 flex-wrap">
                        <button
                          onClick={() => onEdit(course)}
                          className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1"
                        >
                          <FaEdit /> Edit
                        </button>

                        <button
                          onClick={() => onDelete(course.id)}
                          className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1"
                        >
                          <FaTrash /> Delete
                        </button>

                        <button
                          onClick={() => toggleExpand(course.id)}
                          className="bg-gray-300 px-2 py-1 rounded"
                        >
                          {expandedRows[course.id] ? "Hide" : "Details"}
                        </button>
                      </div>
                    </td>
                  </tr>

                 
                  {expandedRows[course.id] && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="p-4">
                        <div className="space-y-4">
                          <p><strong>Title:</strong> {course.title}</p>
                          <p><strong>Category:</strong> {course.category}</p>
                          <p><strong>Short Description:</strong> {course.shortDescription}</p>
                          <p><strong>Long Description:</strong> {course.longDescription}</p>
                          <p><strong>Mode:</strong> {course.mode}</p>
                          <p><strong>Duration:</strong> {course.duration}</p>
                          <p><strong>Schedule:</strong> {course.schedule}</p>
                          <p><strong>Rating:</strong> {course.rating || "-"}</p>
                          <p><strong>Price:</strong> ₹{course.price}</p>

                          <div className="flex flex-wrap gap-4">
                            {course.imageUrl && (
                              <img
                                src={course.imageUrl}
                                alt="Course"
                                className="w-36 h-36 object-cover rounded border"
                              />
                            )}
                            {[course.optionImage1, course.optionImage2, course.optionImage3].map(
                              (img, i) =>
                                img && (
                                  <img
                                    key={i}
                                    src={img}
                                    alt={`Option ${i + 1}`}
                                    className="w-28 h-28 object-cover rounded border"
                                  />
                                )
                            )}
                          </div>

                          {course.instructor && (
                            <div className="flex gap-4 items-start border-t pt-4">
                              {course.instructor.imageUrl && (
                                <img
                                  src={course.instructor.imageUrl}
                                  alt="Instructor"
                                  className="w-24 h-24 object-cover rounded border"
                                />
                              )}
                              <div>
                                <p><strong>Name:</strong> {course.instructor.name}</p>
                                <p><strong>Role:</strong> {course.instructor.role}</p>
                                <p className="text-sm text-gray-600">{course.instructor.description}</p>
                              </div>
                            </div>
                          )}

                          {course.accommodations?.length > 0 && (
                            <div className="border-t pt-4">
                              <h3 className="font-semibold mb-2">Accommodations</h3>
                              <div className="grid md:grid-cols-2 gap-4">
                                {course.accommodations.map((acc) => (
                                  <div key={acc.id} className="flex gap-3 border p-3 rounded">
                                    {acc.imageUrl && (
                                      <img
                                        src={acc.imageUrl}
                                        alt={acc.name}
                                        className="w-20 h-20 object-cover rounded"
                                      />
                                    )}
                                    <div>
                                      <p><strong>Name:</strong> {acc.name}</p>
                                      <p>
                                        <strong>Price:</strong> ₹{acc.price}{" "}
                                        <span className="text-sm text-gray-500">per day</span>
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="md:hidden space-y-4">
        {paginatedCourses.length === 0 ? (
          <div className="text-center p-6 text-gray-500">No courses found.</div>
        ) : (
          paginatedCourses.map((course, idx) => (
            <div key={course.id} className="bg-white shadow rounded p-4 space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-semibold">{course.title}</p>
                  <p className="text-sm text-gray-500">{course.category}</p>
                  <p className="text-sm font-medium">₹{course.price}</p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => onEdit(course)}
                    className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => onDelete(course.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center flex-wrap gap-2">
                <button
                  disabled={loadingId === course.id}
                  onClick={() => handleToggleVisibility(course.id)}
                  className={`px-3 py-1 rounded text-white text-sm ${
                    course.isVisible ? "bg-green-500" : "bg-red-500"
                  }`}
                >
                  {course.isVisible ? "Visible" : "Hidden"}
                </button>
                <button
                  onClick={() => toggleExpand(course.id)}
                  className="bg-gray-300 px-2 py-1 rounded text-sm"
                >
                  {expandedRows[course.id] ? "Hide Details" : "Details"}
                </button>
              </div>

              {expandedRows[course.id] && (
                <div className="pt-2 border-t space-y-2">
                  <p><strong>Short Description:</strong> {course.shortDescription}</p>
                  <p><strong>Long Description:</strong> {course.longDescription}</p>
                  <p><strong>Mode:</strong> {course.mode}</p>
                  <p><strong>Duration:</strong> {course.duration}</p>
                  <p><strong>Schedule:</strong> {course.schedule}</p>
                  <p><strong>Rating:</strong> {course.rating || "-"}</p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    {course.imageUrl && (
                      <img
                        src={course.imageUrl}
                        alt="Course"
                        className="w-28 h-28 object-cover rounded border"
                      />
                    )}
                    {[course.optionImage1, course.optionImage2, course.optionImage3].map(
                      (img, i) =>
                        img && (
                          <img
                            key={i}
                            src={img}
                            alt={`Option ${i + 1}`}
                            className="w-20 h-20 object-cover rounded border"
                          />
                        )
                    )}
                  </div>

                  {course.instructor && (
                    <div className="flex gap-3 items-start border-t pt-2">
                      {course.instructor.imageUrl && (
                        <img
                          src={course.instructor.imageUrl}
                          alt="Instructor"
                          className="w-20 h-20 object-cover rounded border"
                        />
                      )}
                      <div>
                        <p><strong>Name:</strong> {course.instructor.name}</p>
                        <p><strong>Role:</strong> {course.instructor.role}</p>
                        <p className="text-sm text-gray-600">{course.instructor.description}</p>
                      </div>
                    </div>
                  )}

                  {course.accommodations?.length > 0 && (
                    <div className="border-t pt-2">
                      <h3 className="font-semibold mb-2">Accommodations</h3>
                      <div className="space-y-2">
                        {course.accommodations.map((acc) => (
                          <div key={acc.id} className="flex gap-2 border p-2 rounded items-center">
                            {acc.imageUrl && (
                              <img
                                src={acc.imageUrl}
                                alt={acc.name}
                                className="w-16 h-16 object-cover rounded"
                              />
                            )}
                            <div>
                              <p><strong>{acc.name}</strong></p>
                              <p className="text-sm">
                                ₹{acc.price} <span className="text-gray-500 text-xs">per day</span>
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {paginatedCourses.length > 0 && (
        <div className="flex justify-center items-center gap-4 pt-4 flex-wrap">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm font-medium">
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
      )}
    </div>
  );
};

export default CourseTable;
