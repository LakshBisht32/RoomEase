const express = require('express');
const router = express.Router();
const listingRequestController = require('../../../controllers/listingRequestController');
const { requireAuth } = require('../../../middleware/auth');
const requireRole = require('../../../middleware/role');
const requireKycVerified = require('../../../middleware/kycGate');
const validate = require('../../../middleware/validate');
const { sendRequestValidator, respondValidator } = require('../../../validators/listingRequestValidators');

// Sending a request is student-only and KYC-gated, same as roommate
// connections — students shouldn't be able to spam owners before they're
// verified. Responding is owner-only; ownership of the listing itself is
// checked at the query level in listingRequestModel.updateStatus.
router.post('/', requireAuth, requireRole('student'), requireKycVerified, sendRequestValidator, validate, listingRequestController.send);
router.patch('/:id/respond', requireAuth, requireRole('owner'), respondValidator, validate, listingRequestController.respond);
router.get('/', requireAuth, listingRequestController.list);

module.exports = router;
