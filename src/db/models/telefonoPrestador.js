'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TelefonoPrestador extends Model {
    static associate(models) {
      TelefonoPrestador.belongsTo(models.Prestador, {
        foreignKey: 'prestadorId',
      });
    }
  }

  TelefonoPrestador.init(
    {
      telefonoId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nroTelefono: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prestadorId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Prestadores',
          key: 'prestadorId',
        },
        onDelete: 'CASCADE',
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'TelefonoPrestador',
      timestamps: false,
    }
  );

  return TelefonoPrestador;
};
