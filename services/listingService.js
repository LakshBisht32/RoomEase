const listingModel = require('../models/listingModel');
const listingRequestModel = require('../models/listingRequestModel');
const AppError = require('../utils/AppError');

// Multer/Express turn repeated form fields (e.g. multiple amenityIds
// checkboxes with the same name) into an array automatically, but a single
// checked box comes through as a plain string — normalize both cases here.
function toArray(value) {
  if (value === undefined || value === null || value === '') return [];
  return Array.isArray(value) ? value : [value];
}

async function createListing({ ownerId, body, files }) {
  const amenityIds = toArray(body.amenityIds).map(Number);
  const collegeIds = toArray(body.collegeIds).map(Number);
  const collegeLinks = collegeIds.map((collegeId) => ({ collegeId, distanceKm: null }));
  const imagePaths = (files || []).map((f) => `/uploads/listings/${f.filename}`);

  if (imagePaths.length === 0) {
    throw new AppError('At least one listing photo is required.', 400);
  }

  return listingModel.createWithRelations({
    ownerId,
    title: body.title,
    description: body.description,
    rent: Number(body.rent),
    deposit: Number(body.deposit || 0),
    address: body.address,
    lat: body.lat ? Number(body.lat) : null,
    lng: body.lng ? Number(body.lng) : null,
    genderPreference: body.genderPreference || 'any',
    amenityIds,
    collegeLinks,
    imagePaths,
    city: body.city,
    propertyType: body.propertyType || 'pg',
    furnishing: body.furnishing || 'unfurnished',
    sharingType: body.sharingType || 'any',
  });
}

// owner_phone comes back from listingModel.findById() unconditionally (it's
// a plain join), so it's stripped here unless the viewer has earned it: the
// owner themself, or a student whose contact request was accepted. This is
// also where the viewer's own request status is looked up, so the frontend
// knows whether to show "Request contact", "Pending" or the revealed number.
async function getListing(id, viewer) {
  const listing = await listingModel.findById(id);
  if (!listing) throw new AppError('Listing not found.', 404);

  const isOwner = Boolean(viewer) && viewer.role === 'owner' && viewer.id === listing.owner_id;
  let myRequestStatus = null;
  let canSeePhone = isOwner;

  if (!isOwner && viewer && viewer.role === 'student') {
    const existing = await listingRequestModel.findByListingAndStudent(id, viewer.id);
    if (existing) {
      myRequestStatus = existing.status;
      canSeePhone = existing.status === 'accepted';
    }
  }

  if (!canSeePhone) delete listing.owner_phone;
  return { listing, myRequestStatus };
}

async function getOwnerListings(ownerId) {
  return listingModel.findByOwner(ownerId);
}

async function deactivateListing(id, ownerId) {
  const updated = await listingModel.setStatus(id, ownerId, 'inactive');
  if (!updated) throw new AppError('Listing not found or you do not own it.', 404);
  return updated;
}

async function activateListing(id, ownerId) {
  const updated = await listingModel.setStatus(id, ownerId, 'active');
  if (!updated) throw new AppError('Listing not found or you do not own it.', 404);
  return updated;
}

async function deleteListing(id, ownerId) {
  const deleted = await listingModel.remove(id, ownerId);
  if (!deleted) throw new AppError('Listing not found or you do not own it.', 404);
}

module.exports = {
  createListing, getListing, getOwnerListings, deactivateListing, activateListing, deleteListing,
};
