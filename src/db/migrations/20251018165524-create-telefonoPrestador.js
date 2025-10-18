'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TelefonoPrestadors', {
      telefonoId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nroTelefono: {
        type: Sequelize.STRING,
        allowNull: false
      },
      prestadorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Prestadors',
          key: 'prestadorId'
        },
        onDelete: 'CASCADE'
      },
       createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TelefonoPrestadors')
  }
}