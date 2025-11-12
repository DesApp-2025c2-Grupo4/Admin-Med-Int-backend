const Joi = require("joi");
const horarioSchema = require("./horarioSchema");

const agendaDiaSchema = Joi.object({
  idDia: Joi.number().integer().positive().required().messages({
    "number.base": "El idDia debe ser un número",
    "number.integer": "El idDia debe ser un número entero",
    "number.positive": "El idDia debe ser un número positivo",
    "any.required": "El idDia es un campo obligatorio",
  }),

  horarios: Joi.array()
    .items(horarioSchema)
    .min(1)
    .required()
    .messages({
      "array.base": "Los horarios deben ser un arreglo",
      "array.min": "Debe haber al menos un horario por día",
      "any.required": "Los horarios son un campo obligatorio",
    }),
});

module.exports = agendaDiaSchema;
