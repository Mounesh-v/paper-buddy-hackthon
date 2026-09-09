import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import DashboardLayout from '../components/layouts/DashboardLayout';
import useAuth from '../hooks/useAuth';

// Auth & Error Pages
import Login from '../pages/auth/Login';
import Unauthorized from '../pages/errors/Unauthorized';
import NotFound from '../pages/errors/NotFound';

// Admin Pages
import AdminDashboard from '../pages/admin/Dashboard';
import Boards from '../pages/admin/Boards';
import Curricula from '../pages/admin/Curricula';
import Chapters from '../pages/admin/Chapters';
import Topics from '../pages/admin/Topics';
import AdminLessons from '../pages/admin/Lessons';
import AdminAssessments from '../pages/admin/Assessments';
import AdminClassAnalytics from '../pages/admin/ClassAnalytics';
import AdminTeacherAnalytics from '../pages/admin/TeacherAnalytics';
import SystemHealth from '../pages/admin/SystemHealth';

// Teacher Pages
import TeacherDashboard from '../pages/teacher/Dashboard';
import TeacherLessons from '../pages/teacher/Lessons';
import TeacherAssessments from '../pages/teacher/Assessments';
import CreateAssessment from '../pages/teacher/CreateAssessment';
import TeacherHomework from '../pages/teacher/Homework';
import TeacherAIAnalysis from '../pages/teacher/AIAnalysis';
import TeacherAIRecommendations from '../pages/teacher/AIRecommendations';
import TeacherAnalytics from '../pages/teacher/Analytics';

// Student Pages
import StudentDashboard from '../pages/student/Dashboard';
import StudentLessons from '../pages/student/Lessons';
import StudentAssessments from '../pages/student/Assessments';
import TakeAssessment from '../pages/student/TakeAssessment';
import StudentHomework from '../pages/student/Homework';
import StudentPerformance from '../pages/student/Performance';
import StudentAIAnalysis from '../pages/student/AIAnalysis';
import StudentAIRecommendations from '../pages/student/AIRecommendations';

const RoleIndexRedirect = () => {
  const { role } = useAuth();
  if (role === 'ROLE_ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (role === 'ROLE_TEACHER') return <Navigate to="/teacher/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected App Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<RoleIndexRedirect />} />

          {/* ADMIN ROUTES */}
          <Route element={<RoleRoute allowedRoles={['ROLE_ADMIN']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/boards" element={<Boards />} />
            <Route path="/admin/curricula" element={<Curricula />} />
            <Route path="/admin/chapters" element={<Chapters />} />
            <Route path="/admin/topics" element={<Topics />} />
            <Route path="/admin/lessons" element={<AdminLessons />} />
            <Route path="/admin/assessments" element={<AdminAssessments />} />
            <Route path="/admin/class-analytics" element={<AdminClassAnalytics />} />
            <Route path="/admin/teacher-analytics" element={<AdminTeacherAnalytics />} />
            <Route path="/admin/health" element={<SystemHealth />} />
          </Route>

          {/* SHARED TEACHER / ADMIN AI ANALYSIS ROUTES */}
          <Route element={<RoleRoute allowedRoles={['ROLE_TEACHER', 'ROLE_ADMIN']} />}>
            <Route path="/teacher/ai-analysis" element={<TeacherAIAnalysis />} />
            <Route path="/teacher/ai-recommendations" element={<TeacherAIRecommendations />} />
          </Route>

          {/* TEACHER EXCLUSIVE ROUTES */}
          <Route element={<RoleRoute allowedRoles={['ROLE_TEACHER']} />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/lessons" element={<TeacherLessons />} />
            <Route path="/teacher/assessments" element={<TeacherAssessments />} />
            <Route path="/teacher/assessments/create" element={<CreateAssessment />} />
            <Route path="/teacher/homework" element={<TeacherHomework />} />
            <Route path="/teacher/analytics" element={<TeacherAnalytics />} />
          </Route>

          {/* STUDENT ROUTES */}
          <Route element={<RoleRoute allowedRoles={['ROLE_STUDENT']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/lessons" element={<StudentLessons />} />
            <Route path="/student/assessments" element={<StudentAssessments />} />
            <Route path="/student/assessments/take/:attemptId" element={<TakeAssessment />} />
            <Route path="/student/homework" element={<StudentHomework />} />
            <Route path="/student/performance" element={<StudentPerformance />} />
            <Route path="/student/ai-analysis" element={<StudentAIAnalysis />} />
            <Route path="/student/ai-recommendations" element={<StudentAIRecommendations />} />
          </Route>
        </Route>
      </Route>

      {/* 404 Catch All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
