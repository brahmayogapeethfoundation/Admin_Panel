import { NavLink, useLocation } from "react-router-dom";

import logo from "../assets/logo/logo.png";




import { useEffect } from "react";
import {
  FaHome,
  FaBook,
  FaUsers,
  FaBuilding,
  FaQuestionCircle,
  FaStar,
  FaImage,
  FaChalkboardTeacher,
} from "react-icons/fa";
import { X } from "lucide-react";

const Sidebar = ({ open, setOpen }) => {
  const location = useLocation();

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    if (setOpen) setOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:sticky top-0 left-0 z-50
          h-screen w-64 bg-gray-800 text-gray-100
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pt-2 pb-2 border-b border-gray-700">
          <img
              src={logo}
              alt="Admin Panel"
              className="h-12 w-auto pl-20"
            />

          {/* Hide close button on desktop */}
          <button
            className="md:hidden text-gray-200 hover:text-white"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="p-3 space-y-1">
          {[
            { label: "Dashboard", path: "/dashboard", icon: <FaHome /> },
            { label: "Courses", path: "/courses", icon: <FaBook /> },
            { label: "Enrollments", path: "/enrollments", icon: <FaUsers /> },
            { label: "Accommodations", path: "/accommodations", icon: <FaBuilding /> },
            { label: "Instructors", path: "/instructors", icon: <FaChalkboardTeacher /> },
            { label: "Enquiries", path: "/enquiries", icon: <FaQuestionCircle /> },
            { label: "Testimonials", path: "/testimonials", icon: <FaStar /> },
            { label: "Gallery", path: "/gallery", icon: <FaImage /> },
          ].map(({ label, path, icon }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-gray-200
                 hover:bg-gray-700 hover:text-white
                 transition-colors duration-200
                 ${isActive ? "bg-gray-700 text-blue-400" : ""}`
              }
            >
              {icon}
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
