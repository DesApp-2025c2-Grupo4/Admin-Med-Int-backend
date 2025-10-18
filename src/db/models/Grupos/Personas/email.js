'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Email extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Email.belongsTo(models.Persona, {foreignKey: 'personaId'})
    }
  }
  Email.init({
    emailId:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descripcion:{
      type: DataTypes.STRING,
      allowNull: false
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
    modelName: 'Email',
    timestamps: false
  });
  return Email;
};