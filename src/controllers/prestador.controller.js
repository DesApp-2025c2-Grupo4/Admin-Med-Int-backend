const { Prestador, DireccionPrestador, TelefonoPrestador, EmailPrestador, Especialidad, PrestadorEspecialidad, sequelize} = require('../db/models');
const redis = require('../db/config/redis.js')

const createPrestador = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const {
      nombre,
      apellido,
      tipoPrestador,
      asociadoDe, 
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

    const prestador = await Prestador.create(
      { 
            nombre, 
            apellido, 
            tipoPrestador: tipoPrestadorDB, 
            cuilCuit, 
            fechaAlta: fechaAlta ? new Date(fechaAlta) : new Date(),
            asociadoDe: asociadoDe || null 
        },
      { transaction }
    );

    // Crear teléfonos
    await Promise.all(
      telefonos.map(nro => TelefonoPrestador.create({ prestadorId: prestador.prestadorId, nroTelefono: (nro || '').trim() }, { transaction }))
    );

    // Crear emails
    await Promise.all(
      emails.map(mail => EmailPrestador.create({ prestadorId: prestador.prestadorId, descripcion: (mail || '').trim() }, { transaction }))
    );

    // Crear direcciones
    await Promise.all(
      direcciones.map(dirObjeto => {
        if (!dirObjeto || !dirObjeto.calle || !dirObjeto.codigoPostal) return Promise.resolve(null);
        
        const partesCalle = (dirObjeto.calle || '').trim().split(/\s+/).filter(p => p.length > 0);
        let nroExtraido = null;
        let calleFinal = dirObjeto.calle;
        const ultimoFragmento = partesCalle[partesCalle.length - 1];

        if (ultimoFragmento && /^\d+$/.test(ultimoFragmento)) {
            nroExtraido = partesCalle.pop(); 
            calleFinal = partesCalle.join(' '); 
        } else {
            nroExtraido = null;
            calleFinal = dirObjeto.calle;
        }

        return DireccionPrestador.create({ 
            prestadorId: prestador.prestadorId, 
            calle: (calleFinal || '').trim(), 
            nro: nroExtraido,
            codigoPostal: (dirObjeto.codigoPostal || '').trim() 
        }, { transaction });
    })
    );

    // Manejar especialidades
    if (especialidades.length > 0) {
      const especialidadesParaCrear = especialidades.map(id => ({
        prestadorId: prestador.prestadorId,
        especialidadId: Number(id)
      }));
      await PrestadorEspecialidad.bulkCreate(especialidadesParaCrear, { transaction });
    }

    // Traer prestador con relaciones (incluyendo 'centro' para asociadoDe)
    const prestadorConRelaciones = await Prestador.findByPk(prestador.prestadorId, {
      include: [
        { model: DireccionPrestador, as: 'direccion' },
        { model: TelefonoPrestador, as: 'telefonos' },
        { model: EmailPrestador, as: 'email' },
        { model: Especialidad, as: 'especialidad', through: { attributes: [] } },
        { model: Prestador, as: 'centro', attributes: ['prestadorId', 'nombre'] }
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


const getPrestadores = async (_, res) => {
  try {
    const key = 'prestador:list:';
    const prestadores = await Prestador.findAll({
      include: [
        { model: DireccionPrestador, as: 'direccion' },
        { model: TelefonoPrestador, as: 'telefonos' },
        { model: EmailPrestador, as: 'email' },
        { model: Especialidad, as: 'especialidad', through: { attributes: [] } },
        { model: Prestador, as: 'centro', attributes: ['prestadorId', 'nombre'] } 
      ]
    });
    redis.set(key, JSON.stringify(prestadores), { EX: process.env.CACHE_TTL })
    res.status(200).json(prestadores);
  } catch (error) {
    console.error(`Error al obtener los prestadores: ${error}`);
    res.status(500).json({ error: 'Error al obtener los prestadores' });
  }
};

const getPrestadorByPk = async (req, res) => {
  try {
    const { id } = req.params;
    const key = `prestador:${id}`;

    const prestador = await Prestador.findByPk(id, {
      include: [
        { model: DireccionPrestador, as: 'direccion' },
        { model: TelefonoPrestador, as: 'telefonos' },
        { model: EmailPrestador, as: 'email' },
        { model: Especialidad, as: 'especialidad', through: { attributes: [] } },
        { model: Prestador, as: 'centro', attributes: ['prestadorId', 'nombre'] } 
      ]
    });

    if (!prestador) {
      return res.status(404).json({ error: 'Prestador no encontrado' });
    }
    redis.set(key, JSON.stringify(prestador.toJSON()), { EX: process.env.CACHE_TTL })
    res.status(200).json(prestador.toJSON());
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
    asociadoDe, 
    emails,
    telefonos,
    direcciones,
    especialidades
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
      { 
            nombre: nombreValido, 
            apellido: apellidoValido, 
            cuilCuit: cuilCuit || null, 
            tipoPrestador: tipoPrestadorDB, 
            asociadoDe: asociadoDe || null 
        },
      { where: { prestadorId }, transaction: t }
    );

    // emails
    await EmailPrestador.destroy({ where: { prestadorId }, transaction: t });
    if (emails?.length) {
      const nuevosEmails = emails
        .map(e => (typeof e === "string" ? (e || "").trim() : (e?.descripcion || "").trim())) // ✅ FIX
        .filter(e => e)
        .map(descripcion => ({ descripcion, prestadorId }));
      if (nuevosEmails.length) await EmailPrestador.bulkCreate(nuevosEmails, { transaction: t });
    }

    // telefonos
    await TelefonoPrestador.destroy({ where: { prestadorId }, transaction: t });
    if (telefonos?.length) {
      const nuevosTelefonos = telefonos
        .map(t => (typeof t === "string" ? (t || "").trim() : (t?.nroTelefono || "").trim())) // ✅ FIX
        .filter(t => t)
        .map(nroTelefono => ({ nroTelefono, prestadorId }));
      if (nuevosTelefonos.length) await TelefonoPrestador.bulkCreate(nuevosTelefonos, { transaction: t });
    }

    // direcciones
    await DireccionPrestador.destroy({ where: { prestadorId }, transaction: t });
    if (direcciones?.length) {
        const nuevasDirecciones = direcciones
            .map(dirObjeto => { 
            // el último fragmento es el número
                const partesCalle = (dirObjeto.calle || '').trim().split(/\s+/).filter(p => p.length > 0);
                const nro = partesCalle.length > 0 ? partesCalle.pop() : null; // Se guarda el número
                const calle = partesCalle.join(' '); // El resto es la calle

            return {
                calle: (calle || '').trim(),
                nro: nro, 
                codigoPostal: (dirObjeto.codigoPostal || '').trim(), 
                prestadorId
            };
        })
        .filter(dir => dir.calle && dir.codigoPostal); 
        
        if (nuevasDirecciones.length) {
            await DireccionPrestador.bulkCreate(nuevasDirecciones, { transaction: t });
        }
    }

    // especialidades
    if (especialidades !== undefined) {
        const especialidadIdsNuevas = especialidades
        ?.map(id => Number(id))
        .filter(id => !isNaN(id) && id > 0) || []; 

    const prestador = await Prestador.findByPk(prestadorId, {
        include: [{ model: Especialidad, as: 'especialidad' }], 
        transaction: t
    });
    
    if (prestador) {
        // Obtener IDs de especialidades actuales
        const especialidadesActuales = prestador.especialidad || [];
        const especialidadIdsActuales = especialidadesActuales.map(e => e.especialidadId);

        // Identificar cuáles agregar y cuáles eliminar
        const idsParaAgregar = especialidadIdsNuevas.filter(
            id => !especialidadIdsActuales.includes(id)
        );
        const idsParaEliminar = especialidadIdsActuales.filter(
            id => !especialidadIdsNuevas.includes(id)
        );

        // Eliminar relaciones viejas
        if (idsParaEliminar.length > 0) {
            await PrestadorEspecialidad.destroy({
                where: { prestadorId: prestadorId, especialidadId: idsParaEliminar },
                transaction: t
            });
        }

        // Agregar nuevas relaciones
        if (idsParaAgregar.length > 0) {
            const nuevasRelaciones = idsParaAgregar.map(especialidadId => ({
                prestadorId: prestadorId,
                especialidadId: especialidadId
            }));
            await PrestadorEspecialidad.bulkCreate(nuevasRelaciones, { transaction: t });
        }
    }
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