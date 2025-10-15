'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SituacionesTerapeuticas extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SituacionesTerapeuticas.belongsToMany(models.Persona, {
        through: 'situacion-persona',
        foreignKey: 'situacionId',
        otherKey:'personaId',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      })
    }
  }
  SituacionesTerapeuticas.init({
    situacionId:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: false,
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
    modelName: 'SituacionesTerapeuticas',
    timestamps: false
  });
  return SituacionesTerapeuticas;
};