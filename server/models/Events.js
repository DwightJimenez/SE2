module.exports = (sequelize, DataTypes) => {
    const Events = sequelize.define("Events", {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
          },
          start: {
            type: DataTypes.DATE,
            allowNull: false,
          },
          end: {
            type: DataTypes.DATE,
            allowNull: true,
          },
        });
  
    return Events;
  };