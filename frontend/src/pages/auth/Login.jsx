import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {
  GraduationCap,
  Shield,
  UserCheck,
  Key,
  ArrowRight,
} from "lucide-react";
import Button from "../../components/common/Button";

const Login = () => {
  const navigate = useNavigate();
  const { loginRole, loginCustom, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("persona");
  const [customToken, setCustomToken] = useState("");
  const [error, setError] = useState("");

  const handlePersonaLogin = async (roleKey) => {
    try {
      setError("");
      await loginRole(roleKey);
      if (roleKey === "ADMIN") navigate("/admin/dashboard");
      else if (roleKey === "TEACHER") navigate("/teacher/dashboard");
      else navigate("/student/dashboard");
    } catch (e) {
      setError(e.message || "Login failed");
    }
  };

  const handleCustomTokenSubmit = (e) => {
    e.preventDefault();
    try {
      setError("");
      const user = loginCustom(customToken);
      if (user.role === "ROLE_ADMIN") navigate("/admin/dashboard");
      else if (user.role === "ROLE_TEACHER") navigate("/teacher/dashboard");
      else navigate("/student/dashboard");
    } catch (e) {
      setError("Invalid ERP JWT Bearer Token format");
    }
  };

  const personaCards = [
    {
      role: "ADMIN",
      icon: Shield,
      title: "Administrator Portal",
      description: "Curriculum, Boards, Analytics & Health",
    },
    {
      role: "TEACHER",
      icon: UserCheck,
      title: "Educator / Teacher Portal",
      description: "Lessons, Assessment Builder & AI Homework",
    },
    {
      role: "STUDENT",
      icon: GraduationCap,
      title: "Student Portal",
      description: "Take Quizzes, Submit Homework & AI Insights",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa] dark:bg-neutral-950 p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-xl overflow-hidden">
        <div className="p-8 sm:p-10 bg-gradient-to-br from-[#1e2a5e] via-[#2a3a7a] to-[#3d5ee1] text-white flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-white/15 rounded-xl">
                <GraduationCap className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-xl font-bold">ScholarOS</h2>
                <p className="text-xs text-white/60 uppercase tracking-wider">
                  School Management ERP
                </p>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
              Smart Education Platform
            </h1>
            <p className="text-sm text-white/70 mt-3">
              Manage boards, curricula, lessons, assessments, and AI-powered
              learning analytics in one place.
            </p>
          </div>
          <p className="text-[11px] text-white/40 mt-8">
            ScholarOS ERP &copy; 2026
          </p>
        </div>

        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#202c4b] dark:text-white">
              Sign In
            </h3>
            <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg text-xs">
              {["persona", "token"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1 rounded-md font-medium transition-all ${
                    activeTab === tab
                      ? "bg-[#3d5ee1] text-white"
                      : "text-neutral-500"
                  }`}
                >
                  {tab === "persona" ? "Demo Persona" : "Custom JWT"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              {error}
            </div>
          )}

          {activeTab === "persona" ? (
            <div className="space-y-3">
              {personaCards.map(({ role, icon: Icon, title, description }) => (
                <button
                  key={role}
                  onClick={() => handlePersonaLogin(role)}
                  disabled={loading}
                  className="w-full p-4 rounded-xl bg-neutral-50 hover:bg-[#eef1fd] dark:bg-neutral-800 dark:hover:bg-[#3d5ee1]/10 border border-neutral-100 dark:border-neutral-700 hover:border-[#3d5ee1]/30 transition-all text-left group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-[#eef1fd] text-[#3d5ee1]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#202c4b] dark:text-white">
                        {title}
                      </h4>
                      <p className="text-xs text-neutral-500">{description}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-[#3d5ee1] group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCustomTokenSubmit} className="space-y-4">
              <textarea
                rows={5}
                value={customToken}
                onChange={(e) => setCustomToken(e.target.value)}
                placeholder="Paste JWT bearer token..."
                className="w-full p-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-mono focus:outline-none focus:ring-2 focus:ring-[#3d5ee1]/20 focus:border-[#3d5ee1]"
                required
              />
              <Button type="submit" className="w-full" icon={Key}>
                Authenticate
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
