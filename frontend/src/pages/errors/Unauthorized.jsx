import React from "react";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import useAuth from "../../hooks/useAuth";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { role } = useAuth();

  const getHomePath = () => {
    switch (role) {
      case "ROLE_ADMIN":
        return "/admin/dashboard";
      case "ROLE_TEACHER":
        return "/teacher/dashboard";
      case "ROLE_STUDENT":
      default:
        return "/student/dashboard";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950 p-4">
      <div className="max-w-md w-full text-center bg-white dark:bg-neutral-900 rounded-lg p-8 shadow-lg border border-neutral-200 dark:border-neutral-800">
        <div className="w-16 h-16 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center mx-auto mb-4 border border-neutral-200 dark:border-neutral-700">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          403 - Access Denied
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 mb-6">
          You do not have permission to view this resource with your current
          role privileges.
        </p>
        <Button
          onClick={() => navigate(getHomePath())}
          icon={ArrowLeft}
          className="w-full"
        >
          Return to My Dashboard
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
