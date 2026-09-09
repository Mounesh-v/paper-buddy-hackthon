import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar,
  FileCheck,
  ClipboardList,
  CreditCard,
  BookOpen,
  BarChart3,
} from "lucide-react";

export const ADMIN_QUICK_LINKS = [
  { label: "Calendar", icon: Calendar, color: "bg-green-50 text-green-500", path: null },
  { label: "Exam Result", icon: FileCheck, color: "bg-blue-50 text-blue-500", path: "/admin/assessments" },
  { label: "Attendance", icon: ClipboardList, color: "bg-orange-50 text-orange-500", path: "/admin/class-analytics" },
  { label: "Fees", icon: CreditCard, color: "bg-cyan-50 text-cyan-500", path: null },
  { label: "Home Works", icon: BookOpen, color: "bg-red-50 text-red-500", path: "/admin/lessons" },
  { label: "Reports", icon: BarChart3, color: "bg-purple-50 text-purple-500", path: "/admin/teacher-analytics" },
];

export const TEACHER_QUICK_LINKS = [
  { label: "My Lessons", icon: BookOpen, color: "bg-blue-50 text-blue-500", path: "/teacher/lessons" },
  { label: "Assessments", icon: FileCheck, color: "bg-green-50 text-green-500", path: "/teacher/assessments" },
  { label: "Homework", icon: ClipboardList, color: "bg-orange-50 text-orange-500", path: "/teacher/homework" },
  { label: "AI Analysis", icon: BarChart3, color: "bg-purple-50 text-purple-500", path: "/teacher/ai-analysis" },
  { label: "Analytics", icon: Calendar, color: "bg-cyan-50 text-cyan-500", path: "/teacher/analytics" },
  { label: "AI Tips", icon: CreditCard, color: "bg-red-50 text-red-500", path: "/teacher/ai-recommendations" },
];

export const STUDENT_QUICK_LINKS = [
  { label: "Assessments", icon: FileCheck, color: "bg-blue-50 text-blue-500", path: "/student/assessments" },
  { label: "Homework", icon: ClipboardList, color: "bg-orange-50 text-orange-500", path: "/student/homework" },
  { label: "My Lessons", icon: BookOpen, color: "bg-green-50 text-green-500", path: "/student/lessons" },
  { label: "Performance", icon: BarChart3, color: "bg-purple-50 text-purple-500", path: "/student/performance" },
  { label: "AI Insights", icon: Calendar, color: "bg-cyan-50 text-cyan-500", path: "/student/ai-analysis" },
  { label: "Practice", icon: CreditCard, color: "bg-red-50 text-red-500", path: "/student/ai-recommendations" },
];

const QuickLinks = ({ links = ADMIN_QUICK_LINKS, title = "Quick Links" }) => {
  const navigate = useNavigate();

  return (
    <div className="card-panel p-5 h-full">
      <h3 className="text-base font-bold text-[#202c4b] dark:text-white mb-4">
        {title}
      </h3>
      <div className="grid grid-cols-3 gap-3">
        {links.map((link) => {
          const Icon = link.icon;
          return (
            <button
              key={link.label}
              onClick={() => link.path && navigate(link.path)}
              className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group"
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${link.color} group-hover:scale-105 transition-transform`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400 text-center leading-tight">
                {link.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickLinks;
