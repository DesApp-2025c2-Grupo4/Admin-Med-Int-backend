'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DiaDeSemana extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Relacion con Agenda
      DiaDeSemana.belongsTo(models.Agenda, { foreignKey: "agendaId", as: "agenda"})
      //Relacion con Horario
      DiaDeSemana.hasMany(models.Horario, { foreignKey: "idDia", as: "horarios" });
    }
  }
  DiaDeSemana.init(
    {
      idDia: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      descripcion: {
        type: DataTypes.ENUM("Lunes", "Martes",'Miércoles','Jueves','Sábado','Domingo'),
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "DiaDeSemana",
      timestamps: false,
    }
  );
  return DiaDeSemana;
};