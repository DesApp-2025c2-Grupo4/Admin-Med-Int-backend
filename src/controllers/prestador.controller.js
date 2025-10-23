const { Prestador, DireccionPrestador, TelefonoPrestador, EmailPrestador, Especialidad, PrestadorEspecialidad, sequelize} = require('../db/models');

const createPrestador = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      nombre,
      apellido,
      tipoPrestador,
      cuilCuit,
      fechaAlta,
      telefonos = [],
      emails = [],
      direcciones = [],
      especialidades = []
    } = req.body;

    if (!nombre || !apellido || !tipoPrestador || !cuilCuit) {
      return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, apellido, tipoPrestador o cuilCuit' });
    }

    const tipoPrestadorDB = tipoPrestador.toLowerCase() === 'independiente' ? 'Independiente' : 'Centro Médico';

    // Crear prestador
    const prestador = await Prestador.create(
      { nombre, apellido, tipoPrestador: tipoPrestadorDB, cuilCuit, fechaAlta: fechaAlta ? new Date(fechaAlta) : new Date() },
      { transaction }
    );

    // Crear teléfonos
    await Promise.all(
      telefonos.map(nro => TelefonoPrestador.create({ prestadorId: prestador.prestadorId, nroTelefono: nro }, { transaction }))
    );

    // Crear emails
    await Promise.all(
      emails.map(mail => EmailPrestador.create({ prestadorId: prestador.prestadorId, descripcion: mail }, { transaction }))
    );

    // Crear direcciones
    await Promise.all(
      direcciones.map(direccionCompleta => {
        const parts = direccionCompleta.trim().split(' ');
        const nro = parts.length > 1 ? parts.pop() : '';
        const calle = parts.join(' ');
        return DireccionPrestador.create({ prestadorId: prestador.prestadorId, calle, nro, codigoPostal: '0000' }, { transaction });
      })
    );

    // Manejar especialidades
    if (especialidades.length > 0) {
      const especialidadesMap = {
        medicinaGeneral: "Medicina General",
        psicologia: "Psicología",
        cardiologia: "Cardiología",
        nutricion: "Nutrición",
        psiquiatria: "Psiquiatría",
        neurologia: "Neurología",
        oftalmologia: "Oftalmología",
        urologia: "Urología",
        ginecologia: "Ginecología",
        kinesiologia: "Kinesiología",
        pediatria: "Pediatría",
        traumatologia: "Traumatología",
        oncologia: "Oncología"
      };

      const especialidadesDB = especialidades.map(e => especialidadesMap[e]).filter(Boolean);

      const especialidadRecords = [];
      for (const descripcion of especialidadesDB) {
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

    //eliminar cuando se implemente el middleware

    if (!prestador) {
      return res.status(404).json({ error: 'Prestador no encontrado' });
    }

    res.status(200).json(prestador);
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

module.exports = {
  getPrestadores,
  getPrestadorByPk,
  createPrestador,
  deletePrestador
};
