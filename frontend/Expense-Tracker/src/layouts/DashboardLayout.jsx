import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#eef1f7]">
      <Sidebar />

      <div className="pt-28 px-6 max-w-7xl mx-auto">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
