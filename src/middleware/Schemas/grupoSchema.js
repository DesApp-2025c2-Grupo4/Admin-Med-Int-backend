const Joi = require("joi");

// Esquema de validación para el modelo de Grupo
const grupoSchema = Joi.object({
    planId: Joi.number().integer().required().messages({  
    'number.base': 'planId debe ser un número entero',
    'any.required': 'planId es un campo obligatorio.',
    }),
    fechaAlta: Joi.date()
    .iso() // Formato ISO (2023-10-01)
    .optional()
    .messages({
      "date.base": "fechaAlta debe ser una fecha válida",
      "date.format": "fechaAlta debe estar en formato ISO (YYYY-MM-DD)",
      "any.required": "fechaAlta es un campo obligatorio",
    }),
    fechaBaja: Joi.date()
    .allow(null)
    .iso() // Formato ISO (2023-10-01)
    .optional()
    .messages({
      "date.base": "fechaBaja debe ser una fecha válida",
      "date.format": "fechaBaja debe estar en formato ISO (YYYY-MM-DD)",
      "any.required": "fechaBaja es un campo obligatorio",
    }),
    
});

module.exports = grupoSchema;
