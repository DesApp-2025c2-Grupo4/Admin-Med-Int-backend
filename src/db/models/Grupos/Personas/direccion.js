'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Direccion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Direccion.belongsTo(models.Persona, {foreignKey: 'personaId'})
    }
  }
  Direccion.init({
    direccionId:{
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    calle: {
      type: DataTypes.STRING,
      allowNull: false
    },
    nro:{
      type: DataTypes.INTEGER,
      allowNull: true
    },
    personaId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Personas',
        key: 'personaId'
      },
      onDelete: 'CASCADE', // 👈 esta línea es la clave
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Direccion',
    timestamps: false
  });
  return Direccion;
};