const emailSchema = require("./Schemas/emailSchema");
const validarGenerico = require("./validarGenerico");

const validarEmail = validarGenerico(emailSchema, "Datos de email inválidos");

module.exports = validarEmail;
