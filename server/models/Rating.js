module.exports = (sequelize, DataTypes) => {
    const Rating = sequelize.define("Rating", {
      score: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 1,
          max: 5,
        },
      },
    });
    Rating.associate = (models) => {
      Rating.belongsTo(models.Question, {
        foreignKey: {
          allowNull: false,
        },
        onDelete: "CASCADE",
      });
    };
  
    return Rating;
  };