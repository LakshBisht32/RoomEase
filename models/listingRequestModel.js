const pool = require('../config/db');

async function create(listingId, studentId, message) {
  const { rows } = await pool.query(
    `INSERT INTO listing_requests (listing_id, student_id, message)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [listingId, studentId, message || null]
  );
  return rows[0];
}

async function findByListingAndStudent(listingId, studentId) {
  const { rows } = await pool.query(
    `SELECT * FROM listing_requests WHERE listing_id = $1 AND student_id = $2`,
    [listingId, studentId]
  );
  return rows[0] || null;
}

async function hasAcceptedRequest(listingId, studentId) {
  const { rows } = await pool.query(
    `SELECT 1 FROM listing_requests WHERE listing_id = $1 AND student_id = $2 AND status = 'accepted'`,
    [listingId, studentId]
  );
  return rows.length > 0;
}

async function countPendingForStudent(studentId) {
  const { rows } = await pool.query(
    `SELECT COUNT(*)::int AS count FROM listing_requests WHERE student_id = $1 AND status = 'pending'`,
    [studentId]
  );
  return rows[0].count;
}

// Only the owner of the listing the request belongs to may accept/reject —
// enforced here at the query level (UPDATE ... FROM listings, matched on
// l.owner_id) rather than trusting a separate ownership check.
async function updateStatus(id, status, ownerId) {
  const { rows } = await pool.query(
    `UPDATE listing_requests lr
     SET status = $1, responded_at = now()
     FROM listings l
     WHERE lr.id = $2 AND lr.listing_id = l.id AND l.owner_id = $3
     RETURNING lr.*`,
    [status, id, ownerId]
  );
  return rows[0] || null;
}

// Phone is only included in the row once status = 'accepted' — done in SQL
// with a CASE rather than trusting the caller to strip it, so a pending or
// rejected row can never carry the owner's number over the wire.
async function findForStudent(studentId) {
  const { rows } = await pool.query(
    `SELECT lr.*, l.title AS listing_title,
       u.name AS owner_name,
       CASE WHEN lr.status = 'accepted' THEN u.phone ELSE NULL END AS owner_phone
     FROM listing_requests lr
     JOIN listings l ON l.id = lr.listing_id
     JOIN users u ON u.id = l.owner_id
     WHERE lr.student_id = $1
     ORDER BY lr.created_at DESC`,
    [studentId]
  );
  return rows;
}

async function findForOwner(ownerId) {
  const { rows } = await pool.query(
    `SELECT lr.*, l.title AS listing_title,
       s.name AS student_name,
       CASE WHEN lr.status = 'accepted' THEN s.phone ELSE NULL END AS student_phone
     FROM listing_requests lr
     JOIN listings l ON l.id = lr.listing_id
     JOIN users s ON s.id = lr.student_id
     WHERE l.owner_id = $1
     ORDER BY lr.created_at DESC`,
    [ownerId]
  );
  return rows;
}

module.exports = {
  create,
  findByListingAndStudent,
  hasAcceptedRequest,
  countPendingForStudent,
  updateStatus,
  findForStudent,
  findForOwner,
};
