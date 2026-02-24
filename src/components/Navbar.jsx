import { Menu, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ onMenuClick }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("role");
  sessionStorage.clear();

  // 🔔 Notify all tabs
  localStorage.setItem("logout", Date.now());

  navigate("/login", { replace: true });
};


  return (
    <header className="flex justify-between items-center bg-gray-800 text-gray-100 shadow-md px-4 py-3 border-b border-gray-700">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-gray-100 hover:text-white"
        onClick={onMenuClick}
      >
        <Menu size={24} />
      </button>

     

      <button
        onClick={handleLogout}
        className="
          flex items-center ml-auto gap-2 text-white
          bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700
          hover:bg-gradient-to-br
          focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800
          font-medium rounded-lg text-sm px-4 py-2 text-center leading-5
          transition-all duration-200
          hover:scale-105 active:scale-95
          shadow-md hover:shadow-lg 
        "
      >
        <LogOut size={16} />
        Logout
      </button>
    </header>
  );
};

export default Navbar;
