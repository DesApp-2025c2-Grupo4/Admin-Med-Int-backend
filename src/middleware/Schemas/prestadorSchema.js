const Joi = require("joi");

// Esquema para validar una dirección de prestador no se pueden reutilizar los schemas de direccion, email y telefono porque 
// se utilizan de forma distinta que en persona

const direccionSchema = Joi.object({
  calle: Joi.string().trim().min(1).required().messages({
    "string.empty": "La calle no puede estar vacía.",
    "any.required": "La calle es obligatoria.",
  }),
  nro: Joi.number()
    .integer()
    .allow(null)
    .optional()
    .messages({
      "number.base": "El campo 'nro' debe ser un número entero.",
      "number.integer": "El campo 'nro' debe ser un entero válido.",
  }),
  codigoPostal: Joi.string()
    .pattern(/^\d{4}$/)
    .required()
    .messages({
      "string.pattern.base": "El código postal debe tener exactamente 4 dígitos.",
      "any.required": "El código postal es obligatorio.",
    }),
});

// Esquema principal para Prestador
const prestadorSchema = Joi.object({
  cuilCuit: Joi.string()
    .pattern(/^\d{2}-\d{8}-\d{1}$/)
    .required()
    .messages({
      "string.pattern.base": "El CUIL/CUIT debe tener el formato XX-XXXXXXXX-X (ej: 20-12345678-3).",
      "any.required": "El CUIL/CUIT es obligatorio.",
    }),
  tipoPrestador: Joi.string()
    .valid("Independiente", "Centro Médico")
    .required()
    .messages({
      "any.only": 'El tipo de prestador debe ser "Independiente" o "Centro Médico".',
      "any.required": "El tipo de prestador es obligatorio.",
    }),
  asociadoDe: Joi.number()
  .integer()
  .positive()
  .allow(null)
  .optional()
  .messages({
    "number.base": "El ID de asociado debe ser un número entero.",
    "number.positive": "El ID de asociado debe ser un número positivo.",
  }),
  nombre: Joi.string().trim().min(1).required().messages({
    "string.empty": "El nombre no puede estar vacío.",
    "any.required": "El nombre es obligatorio.",
  }),
  apellido: Joi.string().trim().min(1).required().messages({
    "string.empty": "El apellido no puede estar vacío.",
    "any.required": "El apellido es obligatorio.",
  }),
  telefonos: Joi.array()
    .items(
      Joi.string()
        .pattern(/^\d{10}$/)
        .required()
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Debe incluir al menos un teléfono.",
      "string.pattern.base": "Cada teléfono debe ser exactamente 10 dígitos numéricos, como 1122334455.",
      "any.required": "Los teléfonos son obligatorios.",
    }),
  emails: Joi.array()
    .items(
      Joi.string()
        .email()
        .trim()
        .lowercase()
        .required()
    )
    .min(1)
    .required()
    .messages({
      "array.min": "Debe incluir al menos un email.",
      "string.email": "Cada email debe ser válido (ej: usuario@example.com).",
      "any.required": "Los emails son obligatorios.",
    }),
  direcciones: Joi.array().items(direccionSchema).min(1).required().messages({
    "array.min": "Debe incluir al menos una dirección.",
    "any.required": "Las direcciones son obligatorias.",
  }),
  especialidades: Joi.array()
    .items(Joi.number().integer().positive().required())
    .min(1)
    .required()
    .messages({
      "array.min": "Debe incluir al menos una especialidad.",
      "number.base": "Cada especialidad debe ser un ID numérico.",
      "number.positive": "Cada especialidad debe ser un ID positivo.",
      "any.required": "Las especialidades son obligatorias.",
    }),
});

module.exports = prestadorSchema;