'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Grupo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Relacion con integrantes
      //SET NULL si se elimina el grupo las personas quedan sin grupo (o hay que eliminarlas?)
      Grupo.hasMany(models.Persona, {foreignKey: 'idGrupo', onDelete: 'SET NULL', onUpdate: 'CASCADE'})
      //Relacion con Plan Medico
      Grupo.belongsTo(models.PlanMedico, {foreignKey: 'planId', onDelete: 'SET NULL', onUpdate: 'CASCADE'})
    }
  }
  Grupo.init({
    idGrupo:{
      primaryKey:true,
      autoIncrement:true,
      type: DataTypes.INTEGER
    },
    nroGrupo: {
      type: DataTypes.STRING, 
      allowNull: false
    },
    fechaAlta:{
      type: DataTypes.DATEONLY,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Grupo',
    timestamps: false
  });
  return Grupo;
};