import React, { useState } from "react";
import useAuth from "../../hooks/useAuth";
import useTheme from "../../hooks/useTheme";
import {
  Menu,
  Bell,
  ChevronDown,
  LogOut,
  Search,
  Maximize2,
  Moon,
  Sun,
  MessageSquare,
  BarChart2,
  Calendar,
} from "lucide-react";

const Header = ({ onMenuClick, onSidebarToggle }) => {
  const { user, role, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [searchValue, setSearchValue] = useState("");
  const [showUserMenu, setShowUserMenu] = useState(false);

  const getRoleLabel = () => {
    switch (role) {
      case "ROLE_ADMIN":
        return "Administrator";
      case "ROLE_TEACHER":
        return "Teacher";
      case "ROLE_STUDENT":
        return "Student";
      default:
        return "User";
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-4 lg:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={onSidebarToggle}
          className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 hidden md:flex"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="relative flex-1 max-w-md hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search"
            className="w-full pl-9 pr-12 py-2 text-sm bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3d5ee1]/20 focus:border-[#3d5ee1]"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded px-1.5 py-0.5">
            ⌘K
          </kbd>
        </div>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        <button className="hidden lg:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
          <Calendar className="w-3.5 h-3.5 text-[#3d5ee1]" />
          <span>Academic Year : 2024 / 2025</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="w-[18px] h-[18px]" />
          ) : (
            <Moon className="w-[18px] h-[18px]" />
          )}
        </button>

        <button className="hidden sm:flex p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <Maximize2 className="w-[18px] h-[18px]" />
        </button>

        <button className="relative p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <Bell className="w-[18px] h-[18px]" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            1
          </span>
        </button>

        <button className="hidden sm:flex relative p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <MessageSquare className="w-[18px] h-[18px]" />
          <span className="absolute top-1 right-1 w-4 h-4 bg-[#3d5ee1] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        <button className="hidden md:flex p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800">
          <BarChart2 className="w-[18px] h-[18px]" />
        </button>

        <div className="relative ml-1">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#3d5ee1] to-[#6b8aff] text-white flex items-center justify-center font-bold text-sm">
              {user?.name?.charAt(0) || "U"}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-neutral-400 hidden sm:block" />
          </button>

          {showUserMenu && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-neutral-100 dark:border-neutral-800 py-2 z-50"
              onMouseLeave={() => setShowUserMenu(false)}
            >
              <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
                <p className="text-sm font-semibold text-[#202c4b] dark:text-white">
                  {user?.name || "Scholar User"}
                </p>
                <p className="text-xs text-neutral-500 mt-0.5">{getRoleLabel()}</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
