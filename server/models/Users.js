module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define("Users", {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user", // Default role is "user"
      validate: {
        isIn: [["admin", "moderator", "user"]], // Only allow these roles
      },
    },
  });
  Users.associate = (models) => {
    Users.hasMany(models.Likes, {
      onDelete: "cascade",
    });
    Users.hasMany(models.Rating, { onDelete: "CASCADE" });
  };
  return Users;
};
