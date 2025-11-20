const { Persona, Telefono, Email, Prestador } = require('../db/models');

// Middleware para validar DNI único
const validarDniUnico = async (req, res, next) => {
  const { dni } = req.body;

  try {
    const personaExistente = await Persona.findOne({ where: { dni } });
    if (personaExistente) {
      return res.status(400).json({
        error: 'Error de campo único',
        details: [`El DNI '${dni}' ya existe.`],
      });
    }
    next();
  } catch (error) {
    console.error('Error al verificar el campo único DNI:', error);
    return res.status(500).json({
      error: 'Error interno del servidor al verificar campo único DNI.',
    });
  }
};

// Middleware para validar teléfonos únicos 
const validarTelefonosUnicos = async (req, res, next) => {
  const { telefonos } = req.body;
  const errores = [];

  try {
    for (const telefono of telefonos) {
      const telExistente = await Telefono.findOne({ where: { nroTelefono: telefono.nroTelefono } });
      if (telExistente) {
        errores.push(`El teléfono '${telefono.nroTelefono}' ya existe.`);
      }
    }

    if (errores.length > 0) {
      return res.status(400).json({
        error: 'Error de teléfonos duplicados',
        details: errores,
      });
    }
    next();
  } catch (error) {
    console.error('Error al verificar teléfonos únicos:', error);
    return res.status(500).json({
      error: 'Error interno del servidor al verificar teléfonos únicos.',
    });
  }
};

// Middleware para validar emails únicos
const validarEmailsUnicos = async (req, res, next) => {
  const { emails } = req.body;
  const errores = [];

  try {
    for (const email of emails) {
      const emailExistente = await Email.findOne({ where: { descripcion: email.descripcion } });
      if (emailExistente) {
        errores.push(`El email '${email.descripcion}' ya existe.`);
      }
    }

    if (errores.length > 0) {
      return res.status(400).json({
        error: 'Error de emails duplicados',
        details: errores,
      });
    }
    next();
  } catch (error) {
    console.error('Error al verificar emails únicos:', error);
    return res.status(500).json({
      error: 'Error interno del servidor al verificar emails únicos.',
    });
  }
};

// Middleware para validar CUIL/CUIT único
const   validarCuilCuitUnico = async (req, res, next) => {
  const { cuilCuit } = req.body;
  try {
    const prestadorExistente = await Prestador.findOne({ where: { cuilCuit } });
    if (prestadorExistente) {
      return res.status(400).json({
        error: 'Error de campo único',
        details: [`El CUIL/CUIT '${cuilCuit}' ya existe.`],
      });
    }
    next();
  } catch (error) {
    console.error('Error al verificar el campo único CUIL/CUIT:', error);
    return res.status(500).json({
      error: 'Error interno del servidor al verificar campo único CUIL/CUIT.',
    });
  }
};

module.exports = {
  validarDniUnico,
  validarTelefonosUnicos,
  validarEmailsUnicos,
  validarCuilCuitUnico
};