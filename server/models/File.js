// models/Document.js
module.exports = (sequelize, DataTypes) => {
  const File = sequelize.define("File", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  File.associate = (models) => {
    File.hasMany(models.Version, {
      foreignKey: "fileId",
      onDelete: "Set Null",
    });
  };
  return File;
};
