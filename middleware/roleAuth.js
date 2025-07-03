const jwt = require("jsonwebtoken");

function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(403).json({ message: "Access denied" });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ message: "Invalid token" });

      if (!allowedRoles.includes(user.type)) {
        return res.status(403).json({ message: "Unauthorized role" });
      }

      req.user = user;
      next();
    });
  };
}

module.exports = authorizeRoles;
