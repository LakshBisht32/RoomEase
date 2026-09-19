const listingRequestModel = require('../models/listingRequestModel');
const listingModel = require('../models/listingModel');
const AppError = require('../utils/AppError');

const MAX_PENDING_REQUESTS = 5;

async function sendRequest(studentId, listingId, message) {
  const listing = await listingModel.findById(listingId);
  if (!listing) {
    throw new AppError('Listing not found.', 404);
  }

  const existing = await listingRequestModel.findByListingAndStudent(listingId, studentId);
  if (existing) {
    throw new AppError('You already sent a request for this listing.', 409);
  }

  const pendingCount = await listingRequestModel.countPendingForStudent(studentId);
  if (pendingCount >= MAX_PENDING_REQUESTS) {
    throw new AppError('You have too many pending requests. Wait for owners to respond before sending more.', 429);
  }

  return listingRequestModel.create(listingId, studentId, message);
}

async function respondToRequest(requestId, ownerId, decision) {
  const updated = await listingRequestModel.updateStatus(requestId, decision, ownerId);
  if (!updated) {
    throw new AppError('Request not found or you do not own the listing it was sent for.', 404);
  }
  return updated;
}

async function listForUser(user) {
  if (user.role === 'owner') {
    return listingRequestModel.findForOwner(user.id);
  }
  return listingRequestModel.findForStudent(user.id);
}

module.exports = { sendRequest, respondToRequest, listForUser };
