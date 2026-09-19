const express = require('express');
const router = express.Router();
const collegeController = require('../../../controllers/collegeController');
const { requireAuth } = require('../../../middleware/auth');
const validate = require('../../../middleware/validate');
const { createCollegeValidator } = require('../../../validators/collegeValidators');

// Lets a logged-in user add their college on the fly (e.g. from the
// roommate profile combobox) when it isn't in the seeded list yet, instead
// of being stuck with only a handful of pre-loaded colleges to pick from.
router.post('/', requireAuth, createCollegeValidator, validate, collegeController.create);

module.exports = router;
