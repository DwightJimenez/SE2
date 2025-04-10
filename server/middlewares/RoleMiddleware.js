const { Users } = require("../models");

const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await Users.findByPk(req.user.id);
      
      // Check if the user's role is in the array of allowed roles
      if (!roles.includes(user.role)) {
        return res.status(403).json({ error: "Permission denied" });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

module.exports = checkRole;
