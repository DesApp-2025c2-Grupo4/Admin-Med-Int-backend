const Joi = require('joi');
const direccionSchema = require('./direccionSchema')
const telefonoSchema = require('./telefonoSchema')
const emailSchema = require('./emailSchema');
const situacionSchema = require('./situacionSchema');

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

    parentesco: Joi.string()
    .trim() 
    .min(3)
    .max(15) 
    .required()
    .messages({
      'string.base': 'El parentesco debe ser una cadena de texto',
      'string.empty': 'El parentesco no puede estar vacío',
      'string.min': 'El parentesco debe tener al menos 3 caracteres',
      'string.max': 'El parentesco no puede exceder los 15 caracteres',
      'any.required': 'El parentesco es un campo obligatorio',
    }),

    // Para la asociación con Grupo
    idGrupo: Joi.number().integer().required().messages({  
      'number.base': 'idGrupo debe ser un número entero',
      'any.required': 'idGrupo es un campo obligatorio.',
    }),

    // Para la asociación con TipoDocumento
    tipoDocId: Joi.number().integer().required().messages({  
      'number.base': 'tipoDocId debe ser un número entero',
      'any.required': 'tipoDocId es un campo obligatorio.',
    }),

    //Para las otras asociaciones, usando los schemas
    direcciones: Joi.array().items(direccionSchema).required().messages({
      'array.base': 'direcciones debe ser un array',
      'any.required': 'Se debe ingresar al menos una dirección.',
    }),

    telefonos: Joi.array().items(telefonoSchema).required().messages({
      'array.base': 'telefonos debe ser un array',
      'any.required': 'Se debe ingresar al menos un teléfono.',
    }),

    emails: Joi.array().items(emailSchema).required().messages({
      'array.base': 'emails debe ser un array',
      'any.required': 'Se debe ingresar al menos un email.',
    }),

    situacionesTerapeuticas: Joi.array().items(situacionSchema).optional().messages({
      'array.base': 'situacionesTerapeuticas debe ser un array',
    })
});

module.exports = personaSchema;