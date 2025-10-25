const situacionSchema = require('../middleware/Schemas/situacionSchema');
const validarGenerico = require('../middleware/validarGenerico');

const validarSituacion = validarGenerico(situacionSchema, 'Datos de situacion inválidos');
module.exports = validarSituacion;