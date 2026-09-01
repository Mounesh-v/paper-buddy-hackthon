const db = require('../config/database');
const { success, error } = require('../utils/responses');

exports.getNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const notifications = await db('notifications')
      .where({ user_id: req.user.id })
      .orderBy('created_at', 'desc')
      .limit(limit)
      .offset(offset);

    const total = await db('notifications')
      .where({ user_id: req.user.id })
      .count('id as count')
      .first();

    const unread = await db('notifications')
      .where({ user_id: req.user.id, is_read: false })
      .count('id as count')
      .first();

    return success(res, {
      data: notifications,
      pagination: {
        total: parseInt(total.count),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(parseInt(total.count) / limit),
      },
      unreadCount: parseInt(unread.count),
    });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const { notificationId } = req.params;

    const notification = await db('notifications')
      .where({ id: notificationId, user_id: req.user.id })
      .first();

    if (!notification) {
      return error(res, 'Notification not found.', 404);
    }

    await db('notifications')
      .where({ id: notificationId })
      .update({ is_read: true });

    return success(res, { ...notification, is_read: true });
  } catch (err) {
    next(err);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await db('notifications')
      .where({ user_id: req.user.id, is_read: false })
      .update({ is_read: true });

    return success(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
};
