'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PrestadorEspecialidad extends Model {
    static associate(models) {
    }
  }

  PrestadorEspecialidad.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      prestadorId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Prestadores',
          key: 'prestadorId',
        },
        onDelete: 'CASCADE',
      },
      especialidadId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Especialidades',
          key: 'especialidadId',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      modelName: 'PrestadorEspecialidad',
      timestamps: false,
    }
  );

  return PrestadorEspecialidad;
};