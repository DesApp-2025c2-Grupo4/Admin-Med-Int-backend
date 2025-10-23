'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Especialidad extends Model {
    static associate(models) {
      Especialidad.belongsToMany(models.Prestador, {
        through: models.PrestadorEspecialidad,
        foreignKey: 'especialidadId',
        otherKey: 'prestadorId',
        as: 'prestadores',
        onDelete: 'CASCADE',
      });

      Especialidad.hasMany(models.Agenda,
        {
          foreignKey: 'agendaId',
        }
      )
    }
  }

  Especialidad.init(
    {
      especialidadId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      descripcion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Especialidad',
      timestamps: false,
    }
  );

  return Especialidad;
};