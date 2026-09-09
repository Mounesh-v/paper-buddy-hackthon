export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  TEACHER: 'ROLE_TEACHER',
  STUDENT: 'ROLE_STUDENT',
};

export const hasRole = (userRole, allowedRoles) => {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
};

export const NAV_ITEMS = [
  // ADMIN ITEMS
  {
    title: 'Admin Dashboard',
    path: '/admin/dashboard',
    icon: 'LayoutDashboard',
    roles: [ROLES.ADMIN],
  },
  {
    title: 'AI Learning Analysis',
    path: '/teacher/ai-analysis',
    icon: 'Sparkles',
    roles: [ROLES.ADMIN, ROLES.TEACHER],
  },
  {
    title: 'AI Recommendations',
    path: '/teacher/ai-recommendations',
    icon: 'BrainCircuit',
    roles: [ROLES.ADMIN, ROLES.TEACHER],
  },
  {
    title: 'Education Boards',
    path: '/admin/boards',
    icon: 'School',
    roles: [ROLES.ADMIN],
  },
  {
    title: 'Curricula',
    path: '/admin/curricula',
    icon: 'BookOpen',
    roles: [ROLES.ADMIN],
  },
  {
    title: 'Chapters',
    path: '/admin/chapters',
    icon: 'Bookmark',
    roles: [ROLES.ADMIN],
  },
  {
    title: 'Topics',
    path: '/admin/topics',
    icon: 'Layers',
    roles: [ROLES.ADMIN],
  },
  {
    title: 'Lessons Catalog',
    path: '/admin/lessons',
    icon: 'GraduationCap',
    roles: [ROLES.ADMIN],
  },
  {
    title: 'Assessments',
    path: '/admin/assessments',
    icon: 'FileCheck',
    roles: [ROLES.ADMIN],
  },
  {
    title: 'Class Analytics',
    path: '/admin/class-analytics',
    icon: 'BarChart3',
    roles: [ROLES.ADMIN],
  },
  {
    title: 'Teacher Insights',
    path: '/admin/teacher-analytics',
    icon: 'TrendingUp',
    roles: [ROLES.ADMIN],
  },
  {
    title: 'System Health',
    path: '/admin/health',
    icon: 'Activity',
    roles: [ROLES.ADMIN],
  },

  // TEACHER ITEMS
  {
    title: 'Teacher Dashboard',
    path: '/teacher/dashboard',
    icon: 'LayoutDashboard',
    roles: [ROLES.TEACHER],
  },
  {
    title: 'My Lesson Sessions',
    path: '/teacher/lessons',
    icon: 'BookOpen',
    roles: [ROLES.TEACHER],
  },
  {
    title: 'Assessments',
    path: '/teacher/assessments',
    icon: 'FileText',
    roles: [ROLES.TEACHER],
  },
  {
    title: 'Create Assessment',
    path: '/teacher/assessments/create',
    icon: 'PlusCircle',
    roles: [ROLES.TEACHER],
  },
  {
    title: 'Homework Engine',
    path: '/teacher/homework',
    icon: 'FileCode',
    roles: [ROLES.TEACHER],
  },
  {
    title: 'AI Learning Analysis',
    path: '/teacher/ai-analysis',
    icon: 'Sparkles',
    roles: [ROLES.TEACHER, ROLES.ADMIN],
  },
  {
    title: 'AI Recommendations',
    path: '/teacher/ai-recommendations',
    icon: 'BrainCircuit',
    roles: [ROLES.TEACHER, ROLES.ADMIN],
  },
  {
    title: 'Class Analytics',
    path: '/teacher/analytics',
    icon: 'PieChart',
    roles: [ROLES.TEACHER],
  },

  // STUDENT ITEMS
  {
    title: 'Student Dashboard',
    path: '/student/dashboard',
    icon: 'LayoutDashboard',
    roles: [ROLES.STUDENT],
  },
  {
    title: 'My Lessons',
    path: '/student/lessons',
    icon: 'BookOpen',
    roles: [ROLES.STUDENT],
  },
  {
    title: 'My Assessments',
    path: '/student/assessments',
    icon: 'CheckSquare',
    roles: [ROLES.STUDENT],
  },
  {
    title: 'My Homework',
    path: '/student/homework',
    icon: 'ClipboardList',
    roles: [ROLES.STUDENT],
  },
  {
    title: 'My Performance',
    path: '/student/performance',
    icon: 'TrendingUp',
    roles: [ROLES.STUDENT],
  },
  {
    title: 'AI Insights',
    path: '/student/ai-analysis',
    icon: 'Sparkles',
    roles: [ROLES.STUDENT],
  },
  {
    title: 'AI Recommendations',
    path: '/student/ai-recommendations',
    icon: 'Lightbulb',
    roles: [ROLES.STUDENT],
  },
];
