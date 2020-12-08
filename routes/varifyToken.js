const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json({ status: 401, meassage: 'Access Denied' });

  try {
    const verified = jwt.varify(token, process.env.SECRET_KEY);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ status: 400, meassage: 'Invalid Token' });
  }
};
