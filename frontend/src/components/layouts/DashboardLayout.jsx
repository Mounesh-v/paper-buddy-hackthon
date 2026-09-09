import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../layout/Sidebar";
import MobileSidebar from "../layout/MobileSidebar";
import Header from "../layout/Header";
import { Settings } from "lucide-react";

const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f6fa] dark:bg-neutral-950 text-[#202c4b] dark:text-neutral-100 flex">
      <Sidebar
        isCollapsed={isSidebarCollapsed}
        toggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <MobileSidebar
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
      />

      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          isSidebarCollapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        }`}
      >
        <Header
          onMenuClick={() => setIsMobileOpen(true)}
          onSidebarToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        <main className="flex-1 p-4 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>

      <button className="fixed right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-[#3d5ee1] text-white rounded-l-lg shadow-lg flex items-center justify-center hover:bg-[#2f4bc4] transition-colors hidden lg:flex">
        <Settings className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DashboardLayout;
