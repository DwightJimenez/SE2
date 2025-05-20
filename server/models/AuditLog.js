module.exports = (sequelize, DataTypes) => {
  const AuditLog = sequelize.define("AuditLog", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER, // e.g., "admin" or "system"
      allowNull: false,
      references: { model: "users", key: "id" },
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  AuditLog.associate = (models) => {
    AuditLog.belongsTo(models.Users, {
      foreignKey: "userId",
    });
  };

  return AuditLog;
};
