'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PrestadorEspecialidads', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      prestadorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Prestadors',
          key: 'prestadorId'
        },
        onDelete: 'CASCADE'
      },
      especialidadId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Especialidads',
          key: 'especialidadId'
        },
        onDelete: 'CASCADE'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('PrestadorEspecialidads')
  }
}