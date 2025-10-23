'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class DireccionPrestador extends Model {
    static associate(models) {
      DireccionPrestador.belongsTo(models.Prestador, {
        foreignKey: 'prestadorId',
      });

      DireccionPrestador.hasMany(models.Agenda, {
        foreignKey: 'agendaId'
      })
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
      codigoPostal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prestadorId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Prestadors',
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