const { body } = require('express-validator');

const sendRequestValidator = [
  body('listingId').isInt().withMessage('listingId must be a valid listing id').toInt(),
  body('message').optional({ checkFalsy: true }).isString().isLength({ max: 500 }).trim(),
];

const respondValidator = [
  body('decision').isIn(['accepted', 'rejected']).withMessage('Decision must be accepted or rejected'),
];

module.exports = { sendRequestValidator, respondValidator };
