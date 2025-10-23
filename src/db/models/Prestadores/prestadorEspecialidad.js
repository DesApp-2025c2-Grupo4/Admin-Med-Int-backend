'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PrestadorEspecialidad extends Model {
    static associate(models) {
      // Asociación a Prestador
      PrestadorEspecialidad.belongsTo(models.Prestador, {
        foreignKey: 'prestadorId',
        onDelete: 'CASCADE',
      });

      // Asociación a Especialidad
      PrestadorEspecialidad.belongsTo(models.Especialidad, {
        foreignKey: 'especialidadId',
        onDelete: 'CASCADE',
      });
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
          model: 'Prestadors',
          key: 'prestadorId',
        },
        onDelete: 'CASCADE',
      },
      especialidadId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Especialidads',
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