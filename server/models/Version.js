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
      allowNull: true,
    },
    archivedFileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
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
      onDelete: "Set Null",
    });
    Version.belongsTo(models.ArchivedDocument, {
      foreignKey: "archivedFileId",
      onDelete: "SET NULL",
    });
  };

  return Version;
};
