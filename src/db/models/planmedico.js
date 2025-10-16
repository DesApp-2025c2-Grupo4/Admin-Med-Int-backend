'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PlanMedico extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      PlanMedico.hasMany(models.Grupo, {foreignKey: 'planId', onDelete: 'SET NULL', onUpdate: 'CASCADE'})
    }
  }
  PlanMedico.init({
    planId:{
      primaryKey:true,
      autoIncrement:true,
      type: DataTypes.INTEGER
    },
    descripcion: {
      type: DataTypes.STRING, 
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PlanMedico',
    timestamps: false
  });
  return PlanMedico;
};