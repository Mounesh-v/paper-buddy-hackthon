require('dotenv').config();

const normalizeConnectionString = (url) => {
  if (!url) return url;
  if (url.startsWith('jdbc:postgresql://')) {
    return url.replace('jdbc:postgresql://', 'postgresql://');
  }
  return url;
};

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST || process.env.POSTGRES_HOST || 'localhost',
      port: process.env.DB_PORT || process.env.POSTGRES_PORT || 5432,
      database: process.env.DB_NAME || process.env.POSTGRES_DB || 'parentapp',
      user: process.env.DB_USER || process.env.POSTGRES_USER || 'postgres',
      password: process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },

  production: {
    client: 'pg',
    connection: {
      connectionString: normalizeConnectionString(process.env.DATABASE_URL),
      ssl: { rejectUnauthorized: false },
    },
    pool: {
      min: 2,
      max: 20,
    },
    migrations: {
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
};
