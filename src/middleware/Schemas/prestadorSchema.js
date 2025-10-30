const Joi = require("joi");
const direccionSchema = require("./direccionSchema");
const telefonoSchema = require("./telefonoSchema");
const emailSchema = require("./emailSchema");
const especialidadSchema = require("./especialidadSchema");

//Esquema de validación para el modelo de persona
const prestadorSchema = Joi.object({
  nombre: Joi.string().trim().min(3).max(30).required().messages({
    "string.base": "El nombre debe ser una cadena de texto",
    "string.empty": "El nombre no puede estar vacío",
    "string.min": "El nombre debe tener al menos 3 caracteres",
    "string.max": "El nombre no puede exceder los 30 caracteres",
    "any.required": "El nombre es un campo obligatorio",
  }),

  apellido: Joi.string().trim().default("").min(3).max(15).optional().messages({
    "string.base": "El apellido debe ser una cadena de texto",
    "string.min": "El apellido debe tener al menos 3 caracteres",
    "string.max": "El apellido no puede exceder los 15 caracteres",
  }),

  cuilCuit: Joi.string()
    .pattern(/^\d{2}-\d{8}-\d{1}$/) // Patrón exacto: 2 dígitos - 8 dígitos - 1 dígito
    .required()
    .messages({
      "string.pattern.base":
        "El CUIL/CUIT debe tener el formato XX-XXXXXXXX-X (11 dígitos con guiones).",
    }),
  fechaAlta: Joi.date()
    .iso()
    .optional()
    .messages({
      "date.base": "fechaAlta debe ser una fecha válida.",
      "date.format": "fechaAlta debe estar en formato ISO (YYYY-MM-DD)",
    }),

  fechaBaja: Joi.date()
    .iso()
    .allow(null)
    .optional()
    .messages({
      "date.base": "fechaBaja debe ser una fecha válida",
      "date.format": "fechaBaja debe estar en formato ISO (YYYY-MM-DD)",
    }),

  tipoPrestador: Joi.string()
    .lowercase()
    .valid("independiente", "centromedico")
    .required()
    .messages({
      "any.only":
        'El tipo de prestador debe ser "independiente" o "centromedico".',
    }),

  lugarIndependiente: Joi.when("tipoPrestador", {
    is: "independiente",
    then: Joi.string().required().messages({
      "string.base":
        'lugarIndependiente debe ser un string cuando tipoPrestador es "independiente".',
      "any.required":
        'lugarIndependiente es obligatorio cuando tipoPrestador es "independiente".',
    }),
    otherwise: Joi.valid(null).default(null).messages({
      "any.only":
        'lugarIndependiente debe ser null cuando tipoPrestador no es "independiente".',
    }),
  }),

  lugarCentro: Joi.when("tipoPrestador", {
    is: "centromedico",
    then: Joi.string().required().messages({
      "string.base":
        'lugarCentro debe ser un string cuando tipoPrestador es "centromedico".',
      "any.required":
        'lugarCentro es obligatorio cuando tipoPrestador es "centromedico".',
    }),
    otherwise: Joi.valid(null).default(null).messages({
      "any.only":
        'lugarCentro debe ser null cuando tipoPrestador no es "centromedico".',
    }),
  }),

  emails: Joi.array().items(emailSchema).required().messages({
    "array.base": "emails debe ser un array",
    "any.required": "Se debe ingresar al menos un email.",
  }),

  telefonos: Joi.array().items(telefonoSchema).required().messages({
    "array.base": "telefonos debe ser un array",
    "any.required": "Se debe ingresar al menos un teléfono.",
  }),

  direcciones: Joi.array().items(direccionSchema).required().messages({
    "array.base": "direcciones debe ser un array",
    "any.required": "Se debe ingresar al menos una dirección.",
  }),

  especialidades: Joi.array().items(especialidadSchema).optional().messages({
    "array.base": "situacionesTerapeuticas debe ser un array",
  }),
});

module.exports = prestadorSchema;
