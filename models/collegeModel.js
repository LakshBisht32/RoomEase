const pool = require('../config/db');

async function findAll() {
  const { rows } = await pool.query('SELECT * FROM colleges ORDER BY name ASC');
  return rows;
}

async function findById(id) {
  const { rows } = await pool.query('SELECT * FROM colleges WHERE id = $1', [id]);
  return rows[0] || null;
}

// The (name, city) pair is unique, so ON CONFLICT DO UPDATE (a no-op write)
// is used here purely to make RETURNING give back the existing row — this
// makes the endpoint idempotent: typing a college that already exists just
// hands back its id instead of erroring.
async function create(name, city) {
  const { rows } = await pool.query(
    `INSERT INTO colleges (name, city) VALUES ($1, $2)
     ON CONFLICT (name, city) DO UPDATE SET name = EXCLUDED.name
     RETURNING *`,
    [name, city]
  );
  return rows[0];
}

module.exports = { findAll, findById, create };
