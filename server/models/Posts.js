module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define("Posts", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
  });

  Posts.associate = (models) => {
    Posts.hasMany(models.Comments, {
      onDelete: "cascade",
    });

    Posts.hasMany(models.Likes, {
      onDelete: "cascade",
    });

    Posts.belongsTo(models.Users, {
      foreignKey: "userId",
    });
  };

  return Posts;
};
