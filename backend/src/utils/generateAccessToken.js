const jwt = require("jsonwebtoken");
module.exports = function (user) {
  return jwt.sign(user, process.env.SECRET_KEY, { expiresIn: '30d' });
}