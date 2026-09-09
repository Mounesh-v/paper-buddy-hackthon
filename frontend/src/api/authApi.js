import { createDevToken } from '../utils/jwtHelper';

// Presets for demo logins corresponding to real ERP entities
export const DEMO_USERS = {
  ADMIN: {
    userId: '11111111-1111-1111-1111-111111111111',
    username: 'admin.scholaros',
    name: 'Dr. Sarah Jenkins',
    email: 'admin@scholaros.edu',
    role: 'ROLE_ADMIN',
    schoolId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    sectionId: 'f8e7d6c5-b4a3-2109-8765-43210fedcba9',
    gradeId: '99887766-5544-3322-1100-aabbccddeeff',
    academicYearId: '11223344-5566-7788-9900-aabbccddeeff',
  },
  TEACHER: {
    userId: '22222222-2222-2222-2222-222222222222',
    username: 'teacher.roberts',
    name: 'Prof. Mark Roberts',
    email: 'teacher@scholaros.edu',
    role: 'ROLE_TEACHER',
    schoolId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    sectionId: 'f8e7d6c5-b4a3-2109-8765-43210fedcba9',
    gradeId: '99887766-5544-3322-1100-aabbccddeeff',
    academicYearId: '11223344-5566-7788-9900-aabbccddeeff',
  },
  STUDENT: {
    userId: '33333333-3333-3333-3333-333333333333',
    username: 'student.alex',
    name: 'Alex Rivera',
    email: 'alex.student@scholaros.edu',
    role: 'ROLE_STUDENT',
    schoolId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    sectionId: 'f8e7d6c5-b4a3-2109-8765-43210fedcba9',
    gradeId: '99887766-5544-3322-1100-aabbccddeeff',
    academicYearId: '11223344-5566-7788-9900-aabbccddeeff',
  },
};

export const loginWithRole = async (roleKey) => {
  const user = DEMO_USERS[roleKey] || DEMO_USERS.STUDENT;
  const token = createDevToken(user);
  return {
    token,
    user,
  };
};

export const loginWithCustomToken = async (token) => {
  return {
    token,
  };
};
