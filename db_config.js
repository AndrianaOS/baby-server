const { Pool } = require("pg");
const names = new Pool({
  connectionString: process.env.DB_CONNLINK,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = names;
