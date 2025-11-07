'use strict';
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
    // Método para comparar contraseñas
    validarPassword(password) {
      return bcrypt.compareSync(password, this.password);
    }
  }
  Usuario.init({
    userId:{
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement:true
    },
    user: {
      type:DataTypes.STRING,
      allowNull:false,
      unique:true
    },
    password: {
      type:DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    modelName: 'Usuario',
    timestamps:false
  });
  // Hashear la contraseña antes de crear el usuario
  Usuario.beforeCreate(async (usuario) => {
    usuario.password = await bcrypt.hash(usuario.password, 10);
  });
  return Usuario;
};