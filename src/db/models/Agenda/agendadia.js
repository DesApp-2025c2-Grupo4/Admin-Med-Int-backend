"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AgendaDia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      AgendaDia.belongsTo(models.Agenda, { foreignKey: "agendaId" });

      AgendaDia.belongsTo(models.DiaDeSemana, { foreignKey: "idDia", as:'dia' });

      AgendaDia.hasMany(models.Horario, {foreignKey: 'agendaDiaId', as: 'horarios'})
    }
  }
  AgendaDia.init(
    {
      agendaDiaId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      agendaId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Agendas',
          key: 'agendaId'
        },
        onDelete: 'CASCADE', 
        allowNull: false
      },
      idDia: {
        type: DataTypes.INTEGER,
        references: {
          model: 'DiaDeSemanas',
          key: 'idDia'
        }
      }
    },
    {
      sequelize,
      modelName: "AgendaDia",
      timestamps: false
    }
  );
  return AgendaDia;
};
