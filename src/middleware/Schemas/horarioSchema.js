const Joi = require("joi");

// Regex para validar formato HH:MM (hora:minuto)
const horaRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
// Regex para validar duracionTurno: 2 dígitos del "01" a "60" (minutos)
const duracionTurnoRegex = /^(0[1-9]|[1-5][0-9]|60)$/;

const horarioSchema = Joi.object({
  horarioInicio: Joi.string().pattern(horaRegex).required().messages({
    "string.base": "El horarioInicio debe ser una cadena de texto",
    "string.empty": "El horarioInicio no puede estar vacío",
    "string.pattern.base": "El horarioInicio debe tener el formato HH:MM (ej: 11:00)",
    "any.required": "El horarioInicio es un campo obligatorio",
  }),

  horarioFinal: Joi.string().pattern(horaRegex).required().messages({
    "string.base": "El horarioFinal debe ser una cadena de texto",
    "string.empty": "El horarioFinal no puede estar vacío",
    "string.pattern.base": "El horarioFinal debe tener el formato HH:MM (ej: 12:00)",
    "any.required": "El horarioFinal es un campo obligatorio",
  }),

  duracionTurno: Joi.string().pattern(duracionTurnoRegex).required().messages({
    "string.base": "duracionTurno debe ser una cadena de texto",
    "string.empty": "duracionTurno no puede estar vacío",
    "string.pattern.base": "duracionTurno debe ser exactamente 2 dígitos del 01 al 60 (ej: 30)",
    "any.required": "duracionTurno es un campo obligatorio",
  }),
});

module.exports = horarioSchema;
