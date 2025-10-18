'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Prestador extends Model {
    static associate(models) {
      
      Prestador.hasMany(models.TelefonoPrestador, {
        foreignKey: 'prestadorId',
        as: 'telefonos',
        onDelete: 'CASCADE',
      });

      Prestador.hasMany(models.DireccionPrestador, {
        foreignKey: 'prestadorId',
        as: 'direcciones',
        onDelete: 'CASCADE',
      });

      Prestador.belongsToMany(models.Especialidad, {
        through: models.PrestadorEspecialidad,
        foreignKey: 'prestadorId',
        otherKey: 'especialidadId',
        as: 'especialidades',
        onDelete: 'CASCADE',
      });

      Prestador.hasMany(models.EmailPrestador, {foreignKey:'prestadorId', as:'email', onDelete:'CASCADE'})
    }
  }

  Prestador.init(
    {
      prestadorId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tipoPrestador: {
        type: DataTypes.ENUM('Independiente', 'Centro Médico'),
        allowNull: false,
      },
      codigoPostal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      cuilCuit: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      fechaAlta: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Prestador',
      timestamps: false,
    }
  );

  return Prestador;
};