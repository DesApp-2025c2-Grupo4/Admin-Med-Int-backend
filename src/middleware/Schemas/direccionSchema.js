const Joi = require('joi');

// Esquema de validación para el modelo de Direccion
const direccionSchema = Joi.object({
  calle: Joi.string()
    .trim()  
    .min(1) 
    .max(100)  
    .required()  
    .messages({
      'string.base': 'La calle debe ser una cadena de texto',
      'string.empty': 'La calle no puede estar vacía',
      'string.min': 'La calle debe tener al menos 1 carácter',
      'string.max': 'La calle no puede exceder los 100 caracteres',
      'any.required': 'La calle es un campo obligatorio',
    }),

  nro: Joi.number()
    .integer()  
    .min(1)  
    .required()  
    .messages({
      'number.base': 'El nro debe ser un número',
      'number.integer': 'El nro debe ser un número entero',
      'number.min': 'El nro debe ser al menos 1',
      'any.required': 'El nro es un campo obligatorio',
    }),
});

module.exports = direccionSchema;