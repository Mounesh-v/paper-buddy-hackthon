const db = require('../config/database');
const { success, error } = require('../utils/responses');

exports.getAcademics = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Verify parent access
    const access = await db('parent_students')
      .where({ parent_id: req.user.id, student_id: studentId })
      .first();
console.log('Access check result:', access); // Debugging line
    if (!access) {
      return error(res, 'Access denied.', 403);
    }

    // Overall performance
    const overall = await db('exam_results')
      .where({ student_id: studentId })
      .select(
        db.raw('AVG(marks_obtained * 100.0 / NULLIF(total_marks, 0)) as average'),
        db.raw('SUM(marks_obtained) as total_marks_obtained'),
        db.raw('SUM(total_marks) as total_possible'),
        db.raw('COUNT(DISTINCT exam_id) as exams_taken')
      )
      .first();

    // Recent exam results
    const recentResults = await db('exam_results')
      .join('exams', 'exam_results.exam_id', 'exams.id')
      .join('subjects', 'exam_results.subject_id', 'subjects.id')
      .where('exam_results.student_id', studentId)
      .select(
        'exam_results.*',
        'exams.name as examName',
        'exams.date as examDate',
        'subjects.name as subjectName'
      )
      .orderBy('exams.date', 'desc')
      .limit(10);

    // Teacher remarks (from assignments)
    const remarks = await db('assignments')
      .where({ student_id: studentId })
      .whereNotNull('feedback')
      .select('feedback')
      .orderBy('updated_at', 'desc')
      .limit(3);

    return success(res, {
      average: Math.round(overall.average) || 0,
      totalMarksObtained: parseFloat(overall.total_marks_obtained) || 0,
      totalPossible: parseFloat(overall.total_possible) || 0,
      examsTaken: parseInt(overall.exams_taken) || 0,
      result: (overall.average || 0) >= 60 ? 'Pass' : 'Needs Improvement',
      recentResults,
      remarks: remarks.map((r) => r.feedback),
    });
  } catch (err) {
    next(err);
  }
};

exports.getExams = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Verify parent access
    const access = await db('parent_students')
      .where({ parent_id: req.user.id, student_id: studentId })
      .first();

    if (!access) {
      return error(res, 'Access denied.', 403);
    }

    const exams = await db('exams')
      .select('exams.*')
      .orderBy('exams.date', 'desc');

    // Attach results for each exam
    const examsWithResults = await Promise.all(
      exams.map(async (exam) => {
        const results = await db('exam_results')
          .join('subjects', 'exam_results.subject_id', 'subjects.id')
          .where({ exam_id: exam.id, student_id: studentId })
          .select(
            'exam_results.*',
            'subjects.name as subjectName'
          );

        return {
          ...exam,
          results,
          totalMarks: results.reduce((sum, r) => sum + parseFloat(r.marks_obtained), 0),
          totalPossible: results.reduce((sum, r) => sum + parseFloat(r.total_marks), 0),
        };
      })
    );

    return success(res, examsWithResults);
  } catch (err) {
    next(err);
  }
};

exports.getSubjects = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Verify parent access
    const access = await db('parent_students')
      .where({ parent_id: req.user.id, student_id: studentId })
      .first();

    if (!access) {
      return error(res, 'Access denied.', 403);
    }

    const subjects = await db('student_subjects')
      .join('subjects', 'student_subjects.subject_id', 'subjects.id')
      .leftJoin('users', 'student_subjects.teacher_id', 'users.id')
      .where('student_subjects.student_id', studentId)
      .select(
        'subjects.id',
        'subjects.name',
        'subjects.code',
        'users.name as teacherName'
      );

    // Get latest marks for each subject
    const subjectsWithMarks = await Promise.all(
      subjects.map(async (subject) => {
        const latestResult = await db('exam_results')
          .where({ student_id: studentId, subject_id: subject.id })
          .orderBy('created_at', 'desc')
          .select('marks_obtained', 'total_marks', 'grade')
          .first();

        return {
          ...subject,
          marks: latestResult?.marks_obtained || null,
          totalMarks: latestResult?.total_marks || null,
          grade: latestResult?.grade || null,
        };
      })
    );

    return success(res, subjectsWithMarks);
  } catch (err) {
    next(err);
  }
};
