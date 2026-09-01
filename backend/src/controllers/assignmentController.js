const db = require('../config/database');
const { success, error } = require('../utils/responses');

exports.getAssignments = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { status, subject } = req.query;

    // Verify parent access
    const access = await db('parent_students')
      .where({ parent_id: req.user.id, student_id: studentId })
      .first();

    if (!access) {
      return error(res, 'Access denied.', 403);
    }

    let query = db('assignments')
      .leftJoin('subjects', 'assignments.subject_id', 'subjects.id')
      .leftJoin('users', 'assignments.teacher_id', 'users.id')
      .where('assignments.student_id', studentId)
      .select(
        'assignments.*',
        'subjects.name as subject',
        'users.name as teacher'
      )
      .orderBy('assignments.due_date', 'desc');

    if (status) {
      query = query.where('assignments.status', status);
    }

    if (subject) {
      query = query.where('subjects.name', subject);
    }

    const assignments = await query;

    // Auto-update overdue assignments
    const now = new Date();
    for (const assignment of assignments) {
      if (assignment.status === 'PENDING' && new Date(assignment.due_date) < now) {
        await db('assignments')
          .where({ id: assignment.id })
          .update({ status: 'OVERDUE' });
        assignment.status = 'OVERDUE';
      }
    }

    return success(res, assignments);
  } catch (err) {
    next(err);
  }
};

exports.getAssignment = async (req, res, next) => {
  try {
    const { studentId, assignmentId } = req.params;

    // Verify parent access
    const access = await db('parent_students')
      .where({ parent_id: req.user.id, student_id: studentId })
      .first();

    if (!access) {
      return error(res, 'Access denied.', 403);
    }

    const assignment = await db('assignments')
      .leftJoin('subjects', 'assignments.subject_id', 'subjects.id')
      .leftJoin('users', 'assignments.teacher_id', 'users.id')
      .where('assignments.id', assignmentId)
      .andWhere('assignments.student_id', studentId)
      .select(
        'assignments.*',
        'subjects.name as subject',
        'users.name as teacher'
      )
      .first();

    if (!assignment) {
      return error(res, 'Assignment not found.', 404);
    }

    return success(res, assignment);
  } catch (err) {
    next(err);
  }
};
