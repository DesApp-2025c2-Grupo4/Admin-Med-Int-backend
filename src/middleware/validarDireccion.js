const direccionSchema = require('../middleware/Schemas/direccionSchema');
const validarGenerico = require('../middleware/validarGenerico');

const validarDireccion = validarGenerico(direccionSchema, 'Datos de dirección inválidos');
module.exports = validarDireccion;