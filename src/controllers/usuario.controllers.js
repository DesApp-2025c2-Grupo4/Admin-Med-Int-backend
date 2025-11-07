const {Usuario} = require('../db/models')
const SECRET_KEY = process.env.JWT_SECRET || 'mi_secreto_super_seguro';
const jwt = require('jsonwebtoken');

const login = async (req,res) => {
  try {
    const {user,password} = req.body
    const usuarioBuscado = await Usuario.findOne({where: {user}})
    if(!usuarioBuscado) return res.status(404).json({message: 'Usuario o Contraseña incorrecto'})
    const contraseñaValida = usuarioBuscado.validarPassword(password)
    if(!contraseñaValida) return res.status(404).json({message: 'Usuario o Contraseña incorrecto'})
    // Generar token JWT
    const token = jwt.sign(
      { id: usuarioBuscado.userId, user: usuarioBuscado.user },
      SECRET_KEY,
    );
    res.json({message:'Login exitoso', token})
  } catch (error) {
    console.log(error)
    res.json(error)
  }
}

const registrar = async(req,res)=>{
  try {
    const {user, password} = req.body
    const userCreado = await Usuario.create({user, password})
    res.json({user: userCreado.user})
  } catch (error) {
    res.status(500).json({message: 'Error en el servidor'})
  }
}
module.exports = {
  login,
  registrar
}