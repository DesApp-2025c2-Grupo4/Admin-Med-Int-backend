'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Horario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Relacion con Agenda
      Horario.belongsTo(models.DiaDeSemana, { foreignKey: "idDia", as: "dia" });
    }
  }
  Horario.init(
    {
      idHorario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      horarioInicio: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      horarioFinal: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      duracionTurno: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Horario",
      timestamps: false,
    }
  );
  return Horario;
};