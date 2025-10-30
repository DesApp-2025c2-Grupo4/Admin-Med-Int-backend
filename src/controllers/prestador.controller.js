const { Prestador, DireccionPrestador, TelefonoPrestador, EmailPrestador, Especialidad, PrestadorEspecialidad, sequelize} = require('../db/models');

const createPrestador = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      nombre,
      apellido="", //si es centro no se pasa apellido
      tipoPrestador,
      lugarIndependiente,
      lugarCentro,
      cuilCuit,
      fechaAlta,
      telefonos = [],
      emails = [],
      direcciones = [],
      especialidades = []
    } = req.body;

    if (!nombre || !tipoPrestador || !cuilCuit) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, tipoPrestador o cuilCuit' });
    }

    const tipoPrestadorDB = tipoPrestador.toLowerCase() === 'independiente' ? 'Independiente' : 'Centro Médico';

    // Crear prestador
    const prestador = await Prestador.create(
      { nombre, apellido, tipoPrestador: tipoPrestadorDB, lugarIndependiente,
      lugarCentro, cuilCuit, fechaAlta: fechaAlta ? new Date(fechaAlta) : new Date() },
      { transaction }
    );

    // Crear teléfonos
    await Promise.all(
      telefonos.map(nro => TelefonoPrestador.create({ prestadorId: prestador.prestadorId, nroTelefono: nro.nroTelefono }, { transaction }))
    );

    // Crear emails
    await Promise.all(
      emails.map(mail => EmailPrestador.create({ prestadorId: prestador.prestadorId, descripcion: mail.descripcion }, { transaction }))
    );

    // Crear direcciones ANTERIOR
    // await Promise.all(
    //   direcciones.map(direccionCompleta => {
    //     const parts = direccionCompleta.trim().split(' ');
    //     const nro = parts.length > 1 ? parts.pop() : '';
    //     const calle = parts.join(' ');
    //     return DireccionPrestador.create({ prestadorId: prestador.prestadorId, calle, nro, codigoPostal: '0000' }, { transaction });
    //   })
    // );

    // Crear direcciones NUEVO para que funcione con el schema
    await Promise.all(
      direcciones.map(dir => {
        const calle = dir.calle.trim();  // Extrae y trimea la calle
        const nro = dir.nro ? parseInt(dir.nro) : null;  // Convierte nro a número si existe, sino null
      return DireccionPrestador.create({ prestadorId: prestador.prestadorId, calle, nro, codigoPostal: '0000' }, { transaction });
    })
);

    // Manejar especialidades anterior
    // if (especialidades.length > 0) {
    //   const especialidadesMap = {
    //     medicinaGeneral: "Medicina General",
    //     psicologia: "Psicología",
    //     cardiologia: "Cardiología",
    //     nutricion: "Nutrición",
    //     psiquiatria: "Psiquiatría",
    //     neurologia: "Neurología",
    //     oftalmologia: "Oftalmología",
    //     urologia: "Urología",
    //     ginecologia: "Ginecología",
    //     kinesiologia: "Kinesiología",
    //     pediatria: "Pediatría",
    //     traumatologia: "Traumatología",
    //     oncologia: "Oncología"
    //   };

    //   const especialidadesDB = especialidades.map(e => especialidadesMap[e]).filter(Boolean);

    //   const especialidadRecords = [];
    //   for (const descripcion of especialidadesDB) {
    //     const [especialidad] = await Especialidad.findOrCreate({
    //       where: { descripcion },
    //       defaults: { descripcion },
    //       transaction
    //     });
    //     especialidadRecords.push(especialidad);
    //   }

    //   await prestador.addEspecialidad(especialidadRecords, { transaction });
    // }

    // Manejar especialidades nuevo(cambiado para usar descripciones directamente)
    if (especialidades.length > 0) {
      const descripciones = especialidades.map(e => e.descripcion?.trim()).filter(Boolean);
      const especialidadRecords = [];
      for (const descripcion of descripciones) {
        const [especialidad] = await Especialidad.findOrCreate({
          where: { descripcion },
          defaults: { descripcion },
          transaction
        });
        especialidadRecords.push(especialidad);
      }
      await prestador.addEspecialidad(especialidadRecords, { transaction });
    }

    // Traer prestador con relaciones
    const prestadorConRelaciones = await Prestador.findByPk(prestador.prestadorId, {
      include: [
        { model: DireccionPrestador, as: 'direccion' },
        { model: TelefonoPrestador, as: 'telefonos' },
        { model: EmailPrestador, as: 'email' },
        { model: Especialidad, as: 'especialidad', through: { attributes: [] } }
      ],
      transaction
    });

    await transaction.commit();
    res.status(201).json(prestadorConRelaciones);

  } catch (error) {
    await transaction.rollback();
    console.error('Error al crear el prestador:', error);
    res.status(500).json({ error: 'Error al crear el prestador', details: error.errors || error.message });
  }
};

// traer todos
const getPrestadores = async (_, res) => {
  try {
    const prestadores = await Prestador.findAll({
      include: [
        { model: DireccionPrestador, as: 'direccion' },
        { model: TelefonoPrestador, as: 'telefonos' },
        { model: EmailPrestador, as: 'email' },
        {
          model: Especialidad,
          as: 'especialidad',
          through: { attributes: [] } 
        }
      ]
    });

    res.status(200).json(prestadores);
  } catch (error) {
    console.error(`Error al obtener los prestadores: ${error}`);
    res.status(500).json({ error: 'Error al obtener los prestadores' });
  }
};


const getPrestadorByPk = async (req, res) => {
  try {
    const { id } = req.params;

    const prestador = await Prestador.findByPk(id, {
      include: [
        { model: DireccionPrestador, as: 'direccion' },
        { model: TelefonoPrestador, as: 'telefonos' },
        { model: EmailPrestador, as: 'email' },
        {
          model: Especialidad,
          as: 'especialidad',
          through: { attributes: [] }
        }
      ]
    });
    const prestadorData = prestador.toJSON();

    //eliminar cuando se implemente el middleware

    if (!prestador) {
      return res.status(404).json({ error: 'Prestador no encontrado' });
    }

    res.status(200).json(prestadorData);
  } catch (error) {
    console.error(`Error al obtener el prestador: ${error}`);
    res.status(500).json({ error: 'Error al obtener el prestador' });
  }
};



const deletePrestador = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Prestador.destroy({
      where: { prestadorId: id }
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Prestador no encontrado' });
    }

    res.status(200).json({ message: 'Prestador eliminado correctamente' });
  } catch (error) {
    console.error(`Error al eliminar el prestador: ${error}`);
    res.status(500).json({ error: 'Error al eliminar el prestador' });
  }
};

const updatePrestador = async (req, res) => {
  const prestadorId = req.params.id;

  const {
    nombre,
    apellido,
    cuilCuit,
    tipoPrestador,
    lugarIndependiente,
    lugarCentro,
    emails,
    telefonos,
    direcciones,
    especialidad
  } = req.body;

  if (!prestadorId) {
    return res.status(400).send({
      message: "El ID del prestador es requerido"
    });
  }

  const t = await sequelize.transaction();

  try {
    // normalizar tipoPrestador
    const tipoPrestadorDB = tipoPrestador?.toLowerCase() === "independiente" 
      ? "Independiente" 
      : "Centro Médico";

    // normalizar nombre y apellido
    const nombreCompleto = req.body.nombreCompleto?.trim?.() || "";
    const parts = nombreCompleto.split(/\s+/).filter(p => p.length > 0);
    const nombreValido = parts[0] || nombre?.trim?.() || "";
    const apellidoValido = parts.slice(1).join(" ") || apellido?.trim?.() || ".";

    await Prestador.update(
      { nombre: nombreValido, apellido: apellidoValido, cuilCuit, tipoPrestador: tipoPrestadorDB, lugarIndependiente, lugarCentro },
      { where: { prestadorId }, transaction: t }
    );

    // emails
    await EmailPrestador.destroy({ where: { prestadorId }, transaction: t });
    if (emails?.length) {
      const nuevosEmails = emails
        .map(e => (typeof e === "string" ? e.trim() : e?.descripcion?.trim?.()))
        .filter(e => e)
        .map(descripcion => ({ descripcion, prestadorId }));
      if (nuevosEmails.length) await EmailPrestador.bulkCreate(nuevosEmails, { transaction: t });
    }

    // telefonos
    await TelefonoPrestador.destroy({ where: { prestadorId }, transaction: t });
    if (telefonos?.length) {
      const nuevosTelefonos = telefonos
        .map(t => (typeof t === "string" ? t.trim() : t?.nroTelefono?.trim?.()))
        .filter(t => t)
        .map(nroTelefono => ({ nroTelefono, prestadorId }));
      if (nuevosTelefonos.length) await TelefonoPrestador.bulkCreate(nuevosTelefonos, { transaction: t });
    }

    // direcciones
    await DireccionPrestador.destroy({ where: { prestadorId }, transaction: t });
    if (direcciones?.length) {
      const nuevasDirecciones = direcciones
        .map(d => (typeof d === "string" ? d.trim() : d?.descripcion?.trim?.()))
        .filter(d => d)
        .map(d => {
          const parts = d.split(" ");
          return {
            calle: parts.slice(0, -1).join(" ") || d,
            nro: parts[parts.length - 1] || "S/N",
            codigoPostal: "0000",
            prestadorId
          };
        });
      if (nuevasDirecciones.length) await DireccionPrestador.bulkCreate(nuevasDirecciones, { transaction: t });
    }

    // especialidades
    if (especialidad?.length) {
      const descripciones = especialidad.map(e => e.descripcion?.trim()).filter(Boolean);

      const especialidadRecords = [];
      for (const desc of descripciones) {
        const [esp] = await Especialidad.findOrCreate({
          where: { descripcion: desc },
          defaults: { descripcion: desc },
          transaction: t
        });
        especialidadRecords.push(esp);
      }

      const prestadorObj = await Prestador.findByPk(prestadorId, { transaction: t });
      // solo agregamos las nuevas relaciones
      await prestadorObj.addEspecialidad(especialidadRecords, { transaction: t });
    }

    await t.commit();
    res.status(200).send({ message: "Prestador actualizado correctamente.", prestadorId });
  } catch (error) {
    await t.rollback();
    console.error("Error al actualizar el prestador:", error);
    res.status(500).send({
      message: "Error al guardar los cambios del prestador.",
      details: error.message
    });
  }
};


module.exports = {
  getPrestadores,
  getPrestadorByPk,
  createPrestador,
  deletePrestador,
  updatePrestador
};
