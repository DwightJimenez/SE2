// models/ArchivedDocument.js
module.exports = (sequelize, DataTypes) => {
    const ArchivedDocument = sequelize.define('ArchivedDocument', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        version: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
    }, {
        tableName: 'archived_documents', // Custom table name
        timestamps: false, // No `updatedAt` column needed
    });
    return ArchivedDocument;
};
