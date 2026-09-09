const { error } = require('../utils/responses');

const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  if (err.code === '23505') {
    return error(res, 'A record with this data already exists.', 409);
  }

  if (err.code === '23503') {
    return error(res, 'Referenced record not found.', 400);
  }

  if (err.code === '22P02') {
    return error(res, 'Invalid UUID format.', 400);
  }

  return error(res, err.message || 'Internal server error.', err.statusCode || 500);
};

module.exports = errorHandler;
