-- 003_listing_requests.sql
-- Students request contact with a PG owner per-listing (not per-user, since
-- a student may want to reach the same owner about two different listings,
-- and an owner's dashboard needs to know which listing a request is about).
-- Reuses the connection_status enum ('pending'/'accepted'/'rejected') from
-- 001_init.sql — same lifecycle, different relationship.
-- Phone numbers are NOT stored here; owner_phone/student_phone are only
-- ever read from users.phone, and only once a request is 'accepted'
-- (enforced in the model/service layer, not by this schema).

CREATE TABLE listing_requests (
  id BIGSERIAL PRIMARY KEY,
  listing_id BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  student_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  status connection_status NOT NULL DEFAULT 'pending',
  message VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  responded_at TIMESTAMPTZ,
  CONSTRAINT unique_listing_request UNIQUE (listing_id, student_id)
);
CREATE INDEX idx_listing_requests_listing_id ON listing_requests(listing_id);
CREATE INDEX idx_listing_requests_student_id ON listing_requests(student_id);
