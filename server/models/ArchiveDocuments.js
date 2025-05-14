// models/ArchivedDocument.js
module.exports = (sequelize, DataTypes) => {
  const ArchivedDocument = sequelize.define(
    "ArchivedDocument",
    {
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
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "archive", // Custom table name
      timestamps: false, // No `updatedAt` column needed
    }
  );
  ArchivedDocument.associate = (models) => {
    ArchivedDocument.hasMany(models.Version, {
      foreignKey: "archivedFileId",
      onDelete: "SET NULL",
    });
  };  
  return ArchivedDocument;
};
