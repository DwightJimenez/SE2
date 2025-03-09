const { Users } = require("../models");

const checkRole = (role) => {
  return async (req, res, next) => {
    try {
      const user = await Users.findByPk(req.user.id);
      if (user.role !== role) {
        return res.status(403).json({ error: "Permission denied" });
      }
      next();
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
};

module.exports = checkRole;
