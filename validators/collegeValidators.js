const { body } = require('express-validator');

const createCollegeValidator = [
  body('name').trim().notEmpty().isLength({ max: 200 }).withMessage('College name is required.'),
  body('city').trim().notEmpty().isLength({ max: 100 }).withMessage('City is required.'),
];

module.exports = { createCollegeValidator };
