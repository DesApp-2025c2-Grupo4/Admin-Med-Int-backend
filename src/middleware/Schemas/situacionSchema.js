const Joi = require('joi');

const situacionSchema = Joi.object({
    situacionId: Joi.number().integer().required().messages({  
          'number.base': 'situacionId debe ser un número entero',
          'any.required': 'situacionId es un campo obligatorio.',
        }),
    
    esCronica: Joi.boolean()
        .required()
        .messages({
          'boolean.base': 'esCronica debe ser un valor booleano (true o false)',
          'any.required': 'esCronica es un campo obligatorio',
        }),

    fechaInicio: Joi.date()
        .iso() // formato ISO ('1990-01-01')
        .required()
        .messages({
          'date.base': 'fechaInicio debe ser una fecha válida',
          'date.format': 'fechaInicio debe estar en formato ISO (YYYY-MM-DD)',
          'any.required': 'fechaInicio es un campo obligatorio',
        }),

    fechaFin: Joi.date()
        .allow(null)
        .iso() // formato ISO ('1990-01-01')
        .optional()
        .messages({
          'date.base': 'fechaFin debe ser una fecha válida',
          'date.format': 'fechaFin debe estar en formato ISO (YYYY-MM-DD)',
        }),
    
    descripcion: Joi.string()
})

module.exports = situacionSchema;