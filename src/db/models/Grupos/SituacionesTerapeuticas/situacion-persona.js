'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SituacionPersona extends Model {
    static associate(models) {
      // Cada registro pertenece a una persona
      SituacionPersona.belongsTo(models.Persona, {
        foreignKey: 'personaId'
      });

      // Cada registro pertenece a una situación terapéutica
      SituacionPersona.belongsTo(models.SituacionesTerapeuticas, {
        foreignKey: 'situacionId'
      });
    }
  }
  SituacionPersona.init({
    situacionPersonaId:{
      autoIncrement: true,
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    esCronica:{
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    fechaInicio:{
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fechaFin:{
      type: DataTypes.DATEONLY,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'SituacionPersona',
    timestamps: false
  });
  return SituacionPersona;
};