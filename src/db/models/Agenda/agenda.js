'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Agenda extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Relacion con Prestador
      Agenda.belongsTo(models.Prestador, { foreignKey: 'prestadorId', onDelete: 'CASCADE' })
   
      //Relacion con Especialidad
      Agenda.belongsTo(models.Especialidad, {
        foreignKey: 'especialidadId',
        onDelete: 'CASCADE'
      })
      Agenda.belongsTo(models.DireccionPrestador, {
        foreignKey: 'direccionId',
        onDelete: 'CASCADE'
      })

      Agenda.hasMany(models.AgendaDia, {
        foreignKey: 'agendaId',
        as: 'agendas'
      })
    }
  }
  Agenda.init(
    {
      agendaId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      }, prestadorId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Prestadors", 
          key: "prestadorId",
        },
      },
      especialidadId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Especialidads", 
          key: "especialidadId",
        },
      },
      direccionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "DireccionPrestadors", 
          key: "direccionId",
        }
      }
    },
    {
      sequelize,
      modelName: "Agenda",
      timestamps: false,
    }
  );
  return Agenda;
};