'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('audit_logs', 'userId', {
      type: Sequelize.INTEGER,
      allowNull: true, // allow null for now so we can backfill
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('audit_logs', 'userId');
  },
};
