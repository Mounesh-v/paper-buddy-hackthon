import api from './axios';

// Student Master Data API
export const SYSTEM_STUDENTS = [
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Alex Rivera',
    studentCode: 'STU-1001',
    email: 'alex.student@scholaros.edu',
    gradeSection: 'Grade 10 - Section A',
  },
  {
    id: '33333333-3333-3333-3333-333333333334',
    name: 'Rahul Kumar',
    studentCode: 'STU-1002',
    email: 'rahul.kumar@scholaros.edu',
    gradeSection: 'Grade 10 - Section A',
  },
  {
    id: '33333333-3333-3333-3333-333333333335',
    name: 'Priya Sharma',
    studentCode: 'STU-1003',
    email: 'priya.sharma@scholaros.edu',
    gradeSection: 'Grade 10 - Section B',
  },
  {
    id: '33333333-3333-3333-3333-333333333336',
    name: 'Marcus Chen',
    studentCode: 'STU-1004',
    email: 'marcus.chen@scholaros.edu',
    gradeSection: 'Grade 10 - Section B',
  },
];

export const getStudents = async () => {
  try {
    const res = await api.get('/api/v1/students');
    return res.data || res;
  } catch (e) {
    // If backend student list API is not implemented yet, fallback to system student list
    return SYSTEM_STUDENTS;
  }
};

export const getStudentById = async (studentId) => {
  try {
    const res = await api.get(`/api/v1/students/${studentId}`);
    return res.data || res;
  } catch (e) {
    return SYSTEM_STUDENTS.find((s) => s.id === studentId) || {
      id: studentId,
      name: 'Selected Student',
      studentCode: 'STU-REF',
      gradeSection: 'Grade 10',
    };
  }
};
