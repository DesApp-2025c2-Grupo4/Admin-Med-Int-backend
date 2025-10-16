const Joi = require("joi");

// Esquema de validación para el modelo de Telefono
const telefonoSchema = Joi.object({
  nroTelefono: Joi.string()
    .trim()
    .pattern(/^\d{10}$/) //exactamente 10 dígitos (1122334455)
    .required()
    .messages({
      "string.base": "nroTelefono debe ser una cadena de texto.",
      "string.empty": "nroTelefono no puede estar vacío.",
      "string.pattern.base":"nroTelefono debe ser exactamente 10 dígitos numéricos, como 1167246880.",
      "any.required": "nroTelefono es un campo requerido.",
    }),
});

module.exports = telefonoSchema;
