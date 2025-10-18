'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DireccionPrestador extends Model {
    static associate(models) {
      DireccionPrestador.belongsTo(models.Prestador, {
        foreignKey: 'prestadorId',
      });
    }
  }

  DireccionPrestador.init(
    {
      direccionId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      calle: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nro: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      prestadorId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Prestadores',
          key: 'prestadorId',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'DireccionPrestador',
      timestamps: false,
    }
  );

  return DireccionPrestador;
};