'use strict';
const { Model } = require('sequelize');

//PREGUNTAR: TABLA PARA CUIT CUIL? 

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
        as: 'direccion',
        onDelete: 'CASCADE',
      });

      Prestador.belongsToMany(models.Especialidad, {
        through: models.PrestadorEspecialidad,
        foreignKey: 'prestadorId',
        otherKey: 'especialidadId',
        as: 'especialidad',
        onDelete: 'CASCADE',
      });

      Prestador.hasMany(models.EmailPrestador, {foreignKey:'prestadorId', as:'email', onDelete:'CASCADE'})
    
      Prestador.hasMany(models.Agenda, { foreignKey:'prestadorId', as:'agendas', onDelete:'CASCADE' })

      //Relacion con si mismo
      Prestador.hasMany(models.Prestador, {
        foreignKey: 'asociadoDe',
        as: 'asociados',
        onDelete: 'SET NULL'
      });

      Prestador.belongsTo(models.Prestador, {
        foreignKey: 'asociadoDe',
        as: 'centro',
      });
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
      asociadoDe: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'Prestadors',
          key: 'prestadorId'
        }
      }
    },
    {
      sequelize,
      modelName: 'Prestador',
      timestamps: false,
    }
  );

  return Prestador;
};