const db = require('../config/database');
const { success, error } = require('../utils/responses');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await db('users')
      .where({ id: req.user.id })
      .select('id', 'name', 'email', 'phone_number', 'role', 'created_at')
      .first();

    return success(res, user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone_number } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (!name || !name.trim()) {
        return error(res, 'Name cannot be empty.', 400);
      }
      updates.name = name.trim();
    }

    if (phone_number !== undefined) {
      updates.phone_number = phone_number ? phone_number.trim() : null;
    }

    if (Object.keys(updates).length === 0) {
      return error(res, 'No valid fields to update.', 400);
    }

    updates.updated_at = new Date();

    const [updatedUser] = await db('users')
      .where({ id: req.user.id })
      .update(updates)
      .returning(['id', 'name', 'email', 'phone_number', 'role', 'created_at']);

    return success(res, updatedUser, 'Profile updated successfully');
  } catch (err) {
    next(err);
  }
};

exports.getChildren = async (req, res, next) => {
  try {
    const children = await db('students')
      .join('parent_students', 'students.id', 'parent_students.student_id')
      .join('classes', 'students.class_id', 'classes.id')
      .where('parent_students.parent_id', req.user.id)
      .select(
        'students.*',
        'classes.name as className',
        'classes.section',
        'classes.grade'
      );

    return success(res, children);
  } catch (err) {
    next(err);
  }
};

exports.getChild = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Verify parent has access to this student
    const access = await db('parent_students')
      .where({ parent_id: req.user.id, student_id: studentId })
      .first();

    if (!access) {
      return error(res, 'You do not have access to this student\'s information.', 403);
    }

    const child = await db('students')
      .join('classes', 'students.class_id', 'classes.id')
      .where('students.id', studentId)
      .select(
        'students.*',
        'classes.name as className',
        'classes.section',
        'classes.grade'
      )
      .first();

    if (!child) {
      return error(res, 'Student not found.', 404);
    }

    return success(res, child);
  } catch (err) {
    next(err);
  }
};

exports.getDashboard = async (req, res, next) => {
  try {
    const { studentId } = req.query;

    if (!studentId) {
      return error(res, 'Student ID is required.', 400);
    }

    // Verify parent has access
    const access = await db('parent_students')
      .where({ parent_id: req.user.id, student_id: studentId })
      .first();

    if (!access) {
      return error(res, 'Access denied.', 403);
    }

    // Get attendance summary
    const attendanceSummary = await db('attendance')
      .where({ student_id: studentId })
      .select(
        db.raw('COUNT(*) as total'),
        db.raw("COUNT(*) FILTER (WHERE status = 'PRESENT') as present"),
        db.raw("COUNT(*) FILTER (WHERE status = 'ABSENT') as absent"),
        db.raw("COUNT(*) FILTER (WHERE status = 'LATE') as late"),
        db.raw("ROUND(COUNT(*) FILTER (WHERE status = 'PRESENT') * 100.0 / NULLIF(COUNT(*), 0), 1) as percentage")
      )
      .first();

    // Get academics overview
    const academicsOverview = await db('exam_results')
      .where({ student_id: studentId })
      .select(
        db.raw('AVG(marks_obtained * 100.0 / NULLIF(total_marks, 0)) as average'),
        db.raw("MAX(marks_obtained * 100.0 / NULLIF(total_marks, 0)) as best_percentage")
      )
      .first();

    // Get best subject
    const bestSubject = await db('exam_results')
      .join('subjects', 'exam_results.subject_id', 'subjects.id')
      .where('exam_results.student_id', studentId)
      .select('subjects.name')
      .orderByRaw('(exam_results.marks_obtained * 100.0 / NULLIF(exam_results.total_marks, 0)) DESC')
      .first();

    // Get fees summary
    const feesSummary = await db('fees')
      .where({ student_id: studentId })
      .select(
        db.raw('SUM(amount) as total_fees'),
        db.raw("SUM(amount) FILTER (WHERE status = 'PAID') as paid"),
        db.raw("SUM(amount - paid_amount) FILTER (WHERE status != 'PAID') as outstanding")
      )
      .first();

    // Get next due date
    const nextDue = await db('fees')
      .where({ student_id: studentId })
      .whereNot('status', 'PAID')
      .orderBy('due_date', 'asc')
      .select('due_date')
      .first();

    // Get assignments summary
    const assignmentsSummary = await db('assignments')
      .where({ student_id: studentId })
      .select(
        db.raw("COUNT(*) FILTER (WHERE status = 'PENDING') as pending"),
        db.raw("COUNT(*) FILTER (WHERE status = 'SUBMITTED') as submitted"),
        db.raw("COUNT(*) FILTER (WHERE status = 'OVERDUE') as overdue")
      )
      .first();

    // Get upcoming events
    const upcomingEvents = await db('events')
      .where('date', '>=', new Date().toISOString().split('T')[0])
      .orderBy('date', 'asc')
      .limit(3);

    // Get recent announcements
    const recentAnnouncements = await db('announcements')
      .where({ is_active: true })
      .orderBy('created_at', 'desc')
      .limit(2);

    // Get unread notifications count
    const unreadNotifications = await db('notifications')
      .where({ user_id: req.user.id, is_read: false })
      .count('id as count')
      .first();

    // Get unread messages count
    const unreadMessages = await db('messages')
      .join('conversation_participants', 'messages.conversation_id', 'conversation_participants.conversation_id')
      .where('conversation_participants.user_id', req.user.id)
      .where('messages.is_read', false)
      .whereNot('messages.sender_id', req.user.id)
      .count('messages.id as count')
      .first();

    return success(res, {
      attendance: {
        percentage: parseFloat(attendanceSummary.percentage) || 0,
        presentDays: parseInt(attendanceSummary.present) || 0,
        absentDays: parseInt(attendanceSummary.absent) || 0,
        lateDays: parseInt(attendanceSummary.late) || 0,
        totalDays: parseInt(attendanceSummary.total) || 0,
      },
      academics: {
        average: Math.round(academicsOverview.average) || 0,
        topSubject: bestSubject?.name || null,
        result: (academicsOverview.average || 0) >= 60 ? 'Pass' : 'Needs Improvement',
      },
      fees: {
        totalFees: parseFloat(feesSummary.total_fees) || 0,
        paid: parseFloat(feesSummary.paid) || 0,
        outstanding: parseFloat(feesSummary.outstanding) || 0,
        nextDueDate: nextDue?.due_date || null,
        status: (parseFloat(feesSummary.outstanding) || 0) > 0 ? 'PENDING' : 'PAID',
      },
      assignments: {
        pending: parseInt(assignmentsSummary.pending) || 0,
        submitted: parseInt(assignmentsSummary.submitted) || 0,
        overdue: parseInt(assignmentsSummary.overdue) || 0,
      },
      upcomingEvents,
      recentAnnouncements,
      unreadNotifications: parseInt(unreadNotifications.count) || 0,
      unreadMessages: parseInt(unreadMessages.count) || 0,
    });
  } catch (err) {
    next(err);
  }
};
