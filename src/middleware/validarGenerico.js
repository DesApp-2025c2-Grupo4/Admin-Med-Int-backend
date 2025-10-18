const Joi = require('joi');

// Middleware para validar el req.body de la solicitud segun el schema. Hay que agregar un error personalizado

const validarGenerico = (schema, errorMessage) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Devuelve todos los errores
    });

    if (error) {
      return res.status(400).json({
        error: errorMessage,
        //Muestra todos los errores que hubo en la req
        details: error.details.map((detail) => ({
          message: detail.message, //mensaje de error
          path: detail.path, // campo que falló
        })),
      });
    }

  // Si la validación pasa, asigna los datos validados a req.body y sigueee
    req.body = value;
    next();
  };
};

module.exports = validarGenerico;