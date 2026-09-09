const knex = require('knex');
const knexConfig = require('../../knexfile');

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

// Prevent the process from crashing on pool-level DB errors (e.g. auth/connection
// failures on idle clients), which otherwise surface as an unhandled 'error' event.
const pool = db.client && db.client.pool;
if (pool && typeof pool.on === 'function') {
  pool.on('error', (err) => {
    console.error(`[db] Pool error: ${err.message}`);
  });
}

module.exports = db;
