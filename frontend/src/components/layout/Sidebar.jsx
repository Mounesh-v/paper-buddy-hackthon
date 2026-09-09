import React, { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import * as Icons from "lucide-react";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import { NAV_ITEMS, hasRole } from "../../utils/permissions";
import {
  GraduationCap,
  Sun,
  Moon,
  LogOut,
  Menu,
  ChevronDown,
  LayoutDashboard,
  Globe,
} from "lucide-react";

const DASHBOARD_LINKS = [
  { label: "Admin Dashboard", path: "/admin/dashboard", role: "ROLE_ADMIN" },
  { label: "Teacher Dashboard", path: "/teacher/dashboard", role: "ROLE_TEACHER" },
  { label: "Student Dashboard", path: "/student/dashboard", role: "ROLE_STUDENT" },
];

const Sidebar = ({ isCollapsed, toggleCollapse }) => {
  const { role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [dashboardOpen, setDashboardOpen] = useState(true);

  const filteredNav = NAV_ITEMS.filter((item) => hasRole(role, item.roles));
  const mainNav = filteredNav.filter((item) => !item.path.includes("dashboard"));
  const isDashboardActive = location.pathname.includes("/dashboard");

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 bg-white dark:bg-neutral-900 border-r border-neutral-100 dark:border-neutral-800 flex flex-col hidden md:flex ${
        isCollapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      <div className="h-16 px-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-9 h-9 rounded-lg bg-[#3d5ee1] text-white flex items-center justify-center shrink-0">
            <GraduationCap className="w-5 h-5" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg text-[#202c4b] dark:text-white">
              ScholarOS
            </span>
          )}
        </div>
        {!isCollapsed && (
          <button
            onClick={toggleCollapse}
            className="p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}
      </div>

      {!isCollapsed && (
        <div className="mx-3 mt-4 p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[#3d5ee1]/10 flex items-center justify-center shrink-0">
            <Globe className="w-5 h-5 text-[#3d5ee1]" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[#202c4b] dark:text-white truncate">
              Global International
            </p>
            <p className="text-[11px] text-neutral-400 truncate">ScholarOS ERP</p>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
        {!isCollapsed && <p className="section-label">Main</p>}

        <div>
          {!isCollapsed ? (
            <>
              <button
                onClick={() => setDashboardOpen(!dashboardOpen)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isDashboardActive
                    ? "bg-[#eef1fd] dark:bg-[#3d5ee1]/15 text-[#3d5ee1]"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                }`}
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
                <div className="mt-1 ml-4 pl-3 border-l border-neutral-200 dark:border-neutral-700 space-y-0.5">
                  {DASHBOARD_LINKS.filter((d) => hasRole(role, [d.role])).map(
                    (link) => (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        className={({ isActive }) =>
                          `block px-3 py-2 rounded-lg text-sm transition-colors ${
                            isActive
                              ? "text-[#3d5ee1] font-semibold bg-[#eef1fd] dark:bg-[#3d5ee1]/10"
                              : "text-neutral-500 hover:text-[#3d5ee1]"
                          }`
                        }
                      >
                        {link.label}
                      </NavLink>
                    )
                  )}
                </div>
              )}
            </>
          ) : (
            <NavLink
              to={filteredNav[0]?.path || "/"}
              className="flex items-center justify-center p-2.5 rounded-lg text-[#3d5ee1] bg-[#eef1fd] dark:bg-[#3d5ee1]/15"
            >
              <LayoutDashboard className="w-5 h-5" />
            </NavLink>
          )}
        </div>

        {!isCollapsed && mainNav.length > 0 && (
          <>
            <p className="section-label">Management</p>
            <div className="space-y-0.5">
              {mainNav.map((item) => {
                const IconComponent = Icons[item.icon] || Icons.Circle;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-[#eef1fd] dark:bg-[#3d5ee1]/15 text-[#3d5ee1]"
                          : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                      }`
                    }
                  >
                    <IconComponent className="w-[18px] h-[18px] shrink-0" />
                    <span className="truncate">{item.title}</span>
                  </NavLink>
                );
              })}
            </div>
          </>
        )}

        {isCollapsed && (
          <div className="space-y-1">
            {filteredNav.slice(0, 6).map((item) => {
              const IconComponent = Icons[item.icon] || Icons.Circle;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={item.title}
                  className={({ isActive }) =>
                    `flex items-center justify-center p-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-[#eef1fd] dark:bg-[#3d5ee1]/15 text-[#3d5ee1]"
                        : "text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                    }`
                  }
                >
                  <IconComponent className="w-5 h-5" />
                </NavLink>
              );
            })}
          </div>
        )}
      </div>

      <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1 shrink-0">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 shrink-0" />
          ) : (
            <Moon className="w-4 h-4 shrink-0" />
          )}
          {!isCollapsed && (
            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
          )}
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
