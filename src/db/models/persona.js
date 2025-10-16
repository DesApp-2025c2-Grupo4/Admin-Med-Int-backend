'use strict';
const {
  Model
} = require('sequelize');
const { FOREIGNKEYS } = require('sequelize/lib/query-types');
module.exports = (sequelize, DataTypes) => {
  class Persona extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Relacion con Direccion
      Persona.hasMany(models.Direccion, {foreignKey:'personaId', as:'direcciones'})
      //Relacion con telefono
      Persona.hasMany(models.Telefono, {foreignKey:'personaId', as:'telefonos'})
      //Relacion con tipoDoc
      Persona.belongsTo(models.TipoDocumento, {foreignKey: 'tipoDocId'})
      //Relacion con situaciones
      Persona.belongsToMany(models.SituacionesTerapeuticas, {
        through: models.SituacionPersona,
        foreignKey: 'personaId',
        otherKey:'situacionId',
        as:'situacionesTerapeuticas'
      })
      //Relacion con email
      Persona.hasMany(models.Email, {foreignKey:'personaId', as:'email'})
      //Relacion con grupo
      Persona.belongsTo(models.Grupo, {foreignKey:'idGrupo'})
    }
  }
  Persona.init({
    personaId:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    apellido:{
      type: DataTypes.STRING,
      allowNull: false,      
    },
    dni:{
      type: DataTypes.STRING,
      allowNull: false, 
    },
    esTitular:{
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    fechaNacimiento:{
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    fechaAlta:{
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    fechaBaja:{
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    credencial:{
      type: DataTypes.STRING,
      allowNull: false, 
    }
  }, {
    sequelize,
    modelName: 'Persona',
    timestamps: false,
  });
  return Persona;
};