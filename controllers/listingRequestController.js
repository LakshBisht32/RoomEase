const listingRequestService = require('../services/listingRequestService');
const asyncHandler = require('../middleware/asyncHandler');

const send = asyncHandler(async (req, res) => {
  const request = await listingRequestService.sendRequest(req.user.id, req.body.listingId, req.body.message);
  res.status(201).json({ request });
});

const respond = asyncHandler(async (req, res) => {
  const request = await listingRequestService.respondToRequest(req.params.id, req.user.id, req.body.decision);
  res.json({ request });
});

const list = asyncHandler(async (req, res) => {
  const requests = await listingRequestService.listForUser(req.user);
  res.json({ requests });
});

module.exports = { send, respond, list };
