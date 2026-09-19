const collegeModel = require('../models/collegeModel');
const asyncHandler = require('../middleware/asyncHandler');

const create = asyncHandler(async (req, res) => {
  const college = await collegeModel.create(req.body.name, req.body.city);
  res.status(201).json({ college });
});

module.exports = { create };
