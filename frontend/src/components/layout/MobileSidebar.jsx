import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import * as Icons from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import { NAV_ITEMS, hasRole } from "../../utils/permissions";
import {
  X,
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  LayoutDashboard,
  ChevronDown,
  Globe,
} from "lucide-react";

const DASHBOARD_LINKS = [
  { label: "Admin Dashboard", path: "/admin/dashboard", role: "ROLE_ADMIN" },
  { label: "Teacher Dashboard", path: "/teacher/dashboard", role: "ROLE_TEACHER" },
  { label: "Student Dashboard", path: "/student/dashboard", role: "ROLE_STUDENT" },
];

const MobileSidebar = ({ isOpen, onClose }) => {
  const { role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dashboardOpen, setDashboardOpen] = useState(true);

  if (!isOpen) return null;

  const filteredNav = NAV_ITEMS.filter((item) => hasRole(role, item.roles));
  const mainNav = filteredNav.filter((item) => !item.path.includes("dashboard"));

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      <div className="fixed inset-y-0 left-0 w-[280px] bg-white dark:bg-neutral-900 shadow-xl flex flex-col border-r border-neutral-100 dark:border-neutral-800 z-10">
        <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#3d5ee1] text-white flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg text-[#202c4b] dark:text-white">
              ScholarOS
            </span>
          </div>
          <button onClick={onClose} className="p-1 text-neutral-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mx-3 mt-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#3d5ee1]/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-[#3d5ee1]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#202c4b] dark:text-white">
              Global International
            </p>
            <p className="text-[11px] text-neutral-400">ScholarOS ERP</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
          <p className="section-label">Main</p>

          <button
            onClick={() => setDashboardOpen(!dashboardOpen)}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium bg-[#eef1fd] dark:bg-[#3d5ee1]/15 text-[#3d5ee1]"
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-[18px] h-[18px]" />
              <span>Dashboard</span>
            </div>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${dashboardOpen ? "rotate-180" : ""}`}
            />
          </button>

          {dashboardOpen && (
            <div className="ml-4 pl-3 border-l border-neutral-200 dark:border-neutral-700 space-y-0.5">
              {DASHBOARD_LINKS.filter((d) => hasRole(role, [d.role])).map(
                (link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-lg text-sm ${
                        isActive
                          ? "text-[#3d5ee1] font-semibold bg-[#eef1fd] dark:bg-[#3d5ee1]/10"
                          : "text-neutral-500"
                      }`
                    }
                  >
                    {link.label}
                  </NavLink>
                )
              )}
            </div>
          )}

          <p className="section-label">Management</p>
          <div className="space-y-0.5">
            {mainNav.map((item) => {
              const IconComponent = Icons[item.icon] || Icons.Circle;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? "bg-[#eef1fd] dark:bg-[#3d5ee1]/15 text-[#3d5ee1]"
                        : "text-neutral-600 dark:text-neutral-400"
                    }`
                  }
                >
                  <IconComponent className="w-[18px] h-[18px]" />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}
          </div>
        </div>

        <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-600"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          </button>
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileSidebar;
