module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define("Question", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    archivedFileId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });
  Question.associate = (models) => {
    Question.hasMany(models.Rating, {
      onDelete: "cascade",
    });
  };
  return Question;
};
