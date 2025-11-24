const mongoose = require('mongoose');

module.exports = function (paramName = 'id') {
  return (req, res, next) => {
    if (!mongoose.isValidObjectId(req.params[paramName])) {
      return res.status(400).json({ error: `${paramName} is not a valid id` });
    }
    next();
  };
};