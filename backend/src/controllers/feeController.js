const db = require('../config/database');
const { success, error } = require('../utils/responses');

exports.getFees = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Verify parent access
    const access = await db('parent_students')
      .where({ parent_id: req.user.id, student_id: studentId })
      .first();

    if (!access) {
      return error(res, 'Access denied.', 403);
    }

    const fees = await db('fees')
      .where({ student_id: studentId })
      .orderBy('due_date', 'desc');

    // Auto-update overdue fees
    const now = new Date();
    for (const fee of fees) {
      if (fee.status === 'PENDING' && new Date(fee.due_date) < now) {
        await db('fees').where({ id: fee.id }).update({ status: 'OVERDUE' });
        fee.status = 'OVERDUE';
      }
    }

    return success(res, fees);
  } catch (err) {
    next(err);
  }
};

exports.getPayments = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Verify parent access
    const access = await db('parent_students')
      .where({ parent_id: req.user.id, student_id: studentId })
      .first();

    if (!access) {
      return error(res, 'Access denied.', 403);
    }

    const payments = await db('fees')
      .where({ student_id: studentId })
      .where('status', 'PAID')
      .select(
        'id',
        'name',
        'category',
        'amount as paidAmount',
        'paid_date as date',
        'payment_method as paymentMethod',
        'transaction_id as transactionId',
        'receipt_number as receiptNumber',
        'created_at as createdAt'
      )
      .orderBy('paid_date', 'desc');

    return success(res, payments);
  } catch (err) {
    next(err);
  }
};

exports.getReceipts = async (req, res, next) => {
  try {
    const { studentId } = req.params;

    // Verify parent access
    const access = await db('parent_students')
      .where({ parent_id: req.user.id, student_id: studentId })
      .first();

    if (!access) {
      return error(res, 'Access denied.', 403);
    }

    const receipts = await db('fees')
      .where({ student_id: studentId })
      .whereNotNull('receipt_number')
      .select(
        'id',
        'name as description',
        'amount',
        'paid_date as paymentDate',
        'receipt_number as receiptNumber',
        'payment_method as paymentMethod',
        'created_at as createdAt'
      )
      .orderBy('paid_date', 'desc');

    return success(res, receipts);
  } catch (err) {
    next(err);
  }
};
