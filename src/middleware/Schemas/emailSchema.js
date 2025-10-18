const Joi = require("joi");

// Esquema de validación para el modelo de Email
const emailSchema = Joi.object({
  descripcion: Joi.string()
    .email()
    .trim() 
    .lowercase() 
    .required()
    .messages({
      "string.email":
        "La descripción debe ser un email válido (ej: usuario@example.com)",
      "string.base": "La descripción debe ser una cadena de texto",
      "string.empty": "La descripción no puede estar vacía",
      "any.required": "La descripción es un campo obligatorio",
    }),
});

module.exports = emailSchema;
