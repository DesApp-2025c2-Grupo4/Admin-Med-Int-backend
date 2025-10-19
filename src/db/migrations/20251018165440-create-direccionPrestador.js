'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DireccionPrestadors', {
      direccionId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      calle: {
        type: Sequelize.STRING,
        allowNull: false
      },
      nro: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      codigoPostal: {
        type: DataTypes.STRING,
        allowNull: false,
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
    await queryInterface.dropTable('DireccionPrestadors')
  }
}