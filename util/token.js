const jwt = require('jsonwebtoken');

const isAuthenticated = (req) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      return { authenticated: true, user: decoded };
    } catch (err) {
      return { authenticated: false, error: "Invalid token" };
    }
  } else {
    return { authenticated: false, error: "No token provided" };
  }
};

module.exports = isAuthenticated;