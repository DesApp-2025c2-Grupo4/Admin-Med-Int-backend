const Joi = require('joi');

// Esquema de validación para el modelo de Persona
const personaSchema = Joi.object({
  nombre: Joi.string()
    .trim() 
    .min(3)
    .max(15) 
    .required()
    .messages({
      'string.base': 'El nombre debe ser una cadena de texto',
      'string.empty': 'El nombre no puede estar vacío',
      'string.min': 'El nombre debe tener al menos 3 carácte',
      'string.max': 'El nombre no puede exceder los 15 caracteres',
      'any.required': 'El nombre es un campo obligatorio',
    }),

  apellido: Joi.string()
    .trim()
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.base': 'El apellido debe ser una cadena de texto',
      'string.empty': 'El apellido no puede estar vacío',
      'string.min': 'El apellido debe tener al menos 3 carácter',
      'string.max': 'El apellido no puede exceder los 20 caracteres',
      'any.required': 'El apellido es un campo obligatorio',
    }),

  dni: Joi.string()
    .trim()
    .min(6) 
    .max(8) 
    .required()
    .pattern(/^\d+$/) // sólo números
    .messages({
      'string.base': 'El DNI debe ser una cadena de texto',
      'string.empty': 'El DNI no puede estar vacío',
      'string.min': 'El DNI debe tener al menos 6 caracteres',
      'string.max': 'El DNI no puede exceder los 8 caracteres',
      'string.pattern.base': 'El DNI debe contener solo números',
      'any.required': 'El DNI es un campo requerid',
    }),

  esTitular: Joi.boolean()
    .required()
    .messages({
      'boolean.base': 'esTitular debe ser un valor booleano (true o false)',
      'any.required': 'esTitular es un campo obligatorio',
    }),

  fechaNacimiento: Joi.date()
    .iso() // formato ISO ('1990-01-01')
    .required()
    .messages({
      'date.base': 'fechaNacimiento debe ser una fecha válida',
      'date.format': 'fechaNacimiento debe estar en formato ISO (YYYY-MM-DD)',
      'any.required': 'fechaNacimiento es un campo obligatorio.',
    }),

  fechaAlta: Joi.date()
    .iso() 
    .optional() //tiene un defaultValue en el modelo así que no es required -- debatir
    .messages({
      'date.base': 'fechaAlta debe ser una fecha válida.',
      'date.format': 'fechaAlta debe estar en formato ISO (YYYY-MM-DD)',
    }),

  fechaBaja: Joi.date()
    .iso() 
    .allow(null) // Permite null, porque allowNull: true en el modelo
    .optional()
    .messages({
      'date.base': 'fechaBaja debe ser una fecha válida',
      'date.format': 'fechaBaja debe estar en formato ISO (YYYY-MM-DD)',
    }),

  credencial: Joi.string()
    .trim()
    .min(1)
    .max(50) //después modificar
    .required()
    .messages({
      'string.base': 'La credencial debe ser una cadena de texto.',
      'string.empty': 'La credencial no puede estar vacía.',
      'string.min': 'La credencial debe tener al menos 1 carácter.',
      'string.max': 'La credencial no puede exceder los 50 caracteres.',
      'any.required': 'La credencial es un campo obligatorio.',
    }),
});

module.exports = personaSchema;