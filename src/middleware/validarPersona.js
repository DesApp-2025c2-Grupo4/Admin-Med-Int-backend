const Joi = require('joi');
const personaSchema = require('./Schemas/personaSchema'); 

// Middleware para validar el req.body de la solicitud segun el esquema de Persona
const validarPersona = (req, res, next) => {
  const { error, value } = personaSchema.validate(req.body, {
    abortEarly: false, // para devolver todos los errores
  });

  if (error) {
    return res.status(400).json({
      error: 'Datos de persona inválidos',
      details: error.details.map((detail) => ({
        message: detail.message,
        path: detail.path, // Muestra el campo que falló
      })),
    });
  }

  // Si la validación pasa, asigna los datos validados a req.body y sigueee
  req.body = value; 
  next();
};

module.exports = validarPersona;