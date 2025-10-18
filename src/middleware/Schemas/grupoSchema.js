const Joi = require("joi");

// Esquema de validación para el modelo de Grupo
const grupoSchema = Joi.object({
  nroGrupo: Joi.string()
    .length(7) // exactamente 7 caracteres
    .pattern(/^\d{7}$/) // solo dígitos (0-9)
    .required()
    .messages({
      "string.base": "nroGrupo debe ser una cadena de texto",
      "string.length": "nroGrupo debe tener exactamente 7 caracteres",
      "string.pattern.base":"nroGrupo debe consistir solo en dígitos (ej: 0000001)",
      "any.required": "nroGrupo es un campo obligatorio",
    }),

  fechaAlta: Joi.date()
    .iso() // Formato ISO (2023-10-01)
    .required()
    .messages({
      "date.base": "fechaAlta debe ser una fecha válida",
      "date.format": "fechaAlta debe estar en formato ISO (YYYY-MM-DD)",
      "any.required": "fechaAlta es un campo obligatorio",
    }),
});

module.exports = grupoSchema;
