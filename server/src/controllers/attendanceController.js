const db = require('../config/database');
const { success, error } = require('../utils/responses');

exports.getAttendance = async (req, res, next) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate, month, year } = req.query;

    // Verify parent access
    const access = await db('parent_students')
      .where({ parent_id: req.user.id, student_id: studentId })
      .first();

    if (!access) {
      return error(res, 'Access denied.', 403);
    }

    let query = db('attendance')
      .where({ student_id: studentId })
      .orderBy('date', 'desc');

    if (startDate && endDate) {
      query = query.whereBetween('date', [startDate, endDate]);
    } else if (month && year) {
      query = query.whereRaw('EXTRACT(MONTH FROM date) = ? AND EXTRACT(YEAR FROM date) = ?', [month, year]);
    }

    const attendance = await query;

    return success(res, attendance);
  } catch (err) {
    next(err);
  }
};

exports.getAttendanceSummary = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Verify parent access
    const access = await db('parent_students')
      .where({ parent_id: req.user.id, student_id: studentId })
      .first();

    if (!access) {
      return error(res, 'Access denied.', 403);
    }

    const summary = await db('attendance')
      .where({ student_id: studentId })
      .select(
        db.raw('COUNT(*) as total'),
        db.raw("COUNT(*) FILTER (WHERE status = 'PRESENT') as present"),
        db.raw("COUNT(*) FILTER (WHERE status = 'ABSENT') as absent"),
        db.raw("COUNT(*) FILTER (WHERE status = 'LATE') as late"),
        db.raw("COUNT(*) FILTER (WHERE status = 'EXCUSED') as excused"),
        db.raw("ROUND(COUNT(*) FILTER (WHERE status = 'PRESENT') * 100.0 / NULLIF(COUNT(*), 0), 1) as percentage")
      )
      .first();

    // Monthly breakdown
    const monthlyBreakdown = await db('attendance')
      .where({ student_id: studentId })
      .select(
        db.raw("TO_CHAR(date, 'YYYY-MM') as month"),
        db.raw('COUNT(*) as total'),
        db.raw("COUNT(*) FILTER (WHERE status = 'PRESENT') as present"),
        db.raw("COUNT(*) FILTER (WHERE status = 'ABSENT') as absent"),
        db.raw("ROUND(COUNT(*) FILTER (WHERE status = 'PRESENT') * 100.0 / NULLIF(COUNT(*), 0), 1) as percentage")
      )
      .groupBy(db.raw("TO_CHAR(date, 'YYYY-MM')"))
      .orderBy(db.raw("TO_CHAR(date, 'YYYY-MM')"), 'desc')
      .limit(6);

    return success(res, {
      total: parseInt(summary.total) || 0,
      presentDays: parseInt(summary.present) || 0,
      absentDays: parseInt(summary.absent) || 0,
      lateDays: parseInt(summary.late) || 0,
      excusedDays: parseInt(summary.excused) || 0,
      percentage: parseFloat(summary.percentage) || 0,
      monthlyBreakdown,
    });
  } catch (err) {
    next(err);
  }
};
