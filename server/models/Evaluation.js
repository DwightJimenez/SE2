module.exports = (sequelize, DataTypes) => {
  const Evaluation = sequelize.define("Evaluation", {
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
  });
  Evaluation.associate = (models) => {
    Evaluation.hasMany(models.Question, {
      onDelete: "cascade",
    });
  };
  return Evaluation;
};
