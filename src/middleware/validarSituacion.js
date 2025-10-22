const situacionSchema = require('../middleware/Schemas/situacionSchema');
const validarGenerico = require('../middleware/validarGenerico');

const validarSituacion = validarGenerico(situacionSchema, 'Datos de dirección inválidos');
module.exports = validarSituacion;