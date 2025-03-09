module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define ("Posts", {
        text: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    })

    Posts.associate = (models) => {
        Posts.hasMany(models.Comments, {
          onDelete: "cascade",
        });
      };
      
    return Posts
}