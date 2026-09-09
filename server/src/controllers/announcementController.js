const db = require('../config/database');
const { success, error } = require('../utils/responses');

exports.getAnnouncements = async (req, res, next) => {
  try {
    const { priority, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let query = db('announcements')
      .where({ is_active: true })
      .orderBy('created_at', 'desc');

    if (priority) {
      query = query.where('priority', priority);
    }

    const announcements = await query
      .limit(limit)
      .offset(offset);

    const total = await db('announcements')
      .where({ is_active: true })
      .count('id as count')
      .first();

    return success(res, {
      data: announcements,
      pagination: {
        total: parseInt(total.count),
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(parseInt(total.count) / limit),
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getAnnouncement = async (req, res, next) => {
  try {
    const { announcementId } = req.params;

    const announcement = await db('announcements')
      .where({ id: announcementId })
      .first();

    if (!announcement) {
      return error(res, 'Announcement not found.', 404);
    }

    return success(res, announcement);
  } catch (err) {
    next(err);
  }
};
