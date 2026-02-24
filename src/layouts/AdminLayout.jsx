import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const AdminLayout = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar open={open} setOpen={setOpen} />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">
        {/* NAVBAR (VISIBLE ON ALL SCREENS) */}
        <Navbar onMenuClick={() => setOpen(true)} />

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto  bg-gray-100">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
