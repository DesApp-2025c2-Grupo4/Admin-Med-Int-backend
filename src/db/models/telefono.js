'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Telefono extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Telefono.belongsTo(models.Persona, {foreignKey: 'personaId', onDelete: 'CASCADE', onUpdate: 'CASCADE', hooks: true})
    }
  }
  Telefono.init({
    telefonoId:{
      type:DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nroTelefono: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Telefono',
    timestamps: false
  });
  return Telefono;
};