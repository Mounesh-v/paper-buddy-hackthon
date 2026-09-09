const db = require('../config/database');
const { success, error } = require('../utils/responses');

exports.getEvents = async (req, res, next) => {
  try {
    const { type, startDate, endDate } = req.query;

    let query = db('events')
      .where({ is_active: true })
      .orderBy('date', 'asc');

    if (type) {
      query = query.where('type', type);
    }

    if (startDate && endDate) {
      query = query.whereBetween('date', [startDate, endDate]);
    } else if (startDate) {
      query = query.where('date', '>=', startDate);
    } else if (endDate) {
      query = query.where('date', '<=', endDate);
    }

    const events = await query;

    return success(res, events);
  } catch (err) {
    next(err);
  }
};

exports.getEvent = async (req, res, next) => {
  try {
    const { eventId } = req.params;

    const event = await db('events')
      .where({ id: eventId })
      .first();

    if (!event) {
      return error(res, 'Event not found.', 404);
    }

    return success(res, event);
  } catch (err) {
    next(err);
  }
};
