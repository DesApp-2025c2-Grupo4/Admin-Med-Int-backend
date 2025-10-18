'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EmailPrestador extends Model {
    static associate(models) {
      EmailPrestador.belongsTo(models.Prestador, {foreignKey: 'prestadorId'})
    }
  }
  EmailPrestador.init({
    emailPrestadorId:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    descripcion:{
      type: DataTypes.STRING,
      allowNull: false
    },
    prestadorId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Prestadores',
        key: 'prestadorId'
      },
      onDelete: 'CASCADE', // 👈 esta línea es la clave
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'EmailPrestador',
    timestamps: false
  });
  return EmailPrestador;
};