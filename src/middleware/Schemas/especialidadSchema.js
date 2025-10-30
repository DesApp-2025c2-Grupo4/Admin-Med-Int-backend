const Joi = require("joi");

const especialidadSchema = Joi.object({
  descripcion: Joi.string().trim().required().messages({
    "string.base":"La descripción de la especialidad debe ser una cadena de texto",
    "string.empty": "La descripción de la especialidad no puede estar vacía",
    "any.required": "La descripción de la especialidad es obligatoria",
  }),
});

module.exports = especialidadSchema;