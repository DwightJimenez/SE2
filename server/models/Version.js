module.exports = (sequelize, DataTypes) => {
  const Version = sequelize.define("Version", {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    commitMessage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    fileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  Version.associate = (models) => {
    Version.belongsTo(models.Users, {
      foreignKey: "userId",
      onDelete: "CASCADE",
    });
    Version.belongsTo(models.File, {
      foreignKey: "fileId",
      onDelete: "CASCADE",
    });
  };

  return Version;
};
