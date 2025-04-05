module.exports = (sequelize, DataTypes) => {
  const Question = sequelize.define("Question", {
    text: { type: DataTypes.STRING, allowNull: false },
  });
  Question.associate = (models) => {
    Question.hasMany(models.Rating, {
      onDelete: "cascade",
    });
  };
  return Question;
};
