const {
  Prestador,
  DireccionPrestador,
  TelefonoPrestador,
  EmailPrestador,
  Especialidad,
  PrestadorEspecialidad,
  Agenda,
  sequelize,
} = require("../db/models");
const redis = require("../db/config/redis.js");
const { Op, where } = require("sequelize");
const dotenv = require("dotenv");
dotenv.config();

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
      especialidades = [],
    } = req.body;

    if (!nombre || !apellido || !tipoPrestador || !cuilCuit) {
      return res
        .status(400)
        .json({
          error:
            "Faltan campos obligatorios: nombre, apellido, tipoPrestador o cuilCuit",
        });
    }
    // Validacion que tenga al menos un contacto
    if (
      !Array.isArray(telefonos) ||
      telefonos.length === 0 ||
      !Array.isArray(emails) ||
      emails.length === 0 ||
      !Array.isArray(direcciones) ||
      direcciones.length === 0
    ) {
      return res
        .status(400)
        .json({
          error: "Debe incluir al menos un teléfono, un email y una dirección.",
        });
    }
    const tipoPrestadorDB =
      tipoPrestador.toLowerCase() === "independiente"
        ? "Independiente"
        : "Centro Médico";

    const prestador = await Prestador.create(
      {
        nombre,
        apellido,
        tipoPrestador: tipoPrestadorDB,
        cuilCuit,
        fechaAlta: fechaAlta ? new Date(fechaAlta) : new Date(),
        asociadoDe: asociadoDe || null,
      },
      { transaction }
    ); // Crear teléfonos

    await Promise.all(
      telefonos.map((nro) =>
        TelefonoPrestador.create(
          {
            prestadorId: prestador.prestadorId,
            nroTelefono: (nro || "").trim(),
          },
          { transaction }
        )
      )
    ); // Crear emails

    await Promise.all(
      emails.map((mail) =>
        EmailPrestador.create(
          {
            prestadorId: prestador.prestadorId,
            descripcion: (mail || "").trim(),
          },
          { transaction }
        )
      )
    ); // Crear direcciones

    await DireccionPrestador.bulkCreate(
      direcciones.map(d => ({
        ...d,
        prestadorId: prestador.prestadorId
      })),
      { transaction }
    );    
    // Manejar especialidades

    if (especialidades.length > 0) {
      const especialidadesParaCrear = especialidades.map((id) => ({
        prestadorId: prestador.prestadorId,
        especialidadId: Number(id),
      }));
      await PrestadorEspecialidad.bulkCreate(especialidadesParaCrear, {
        transaction,
      });
    } // Traer prestador con relaciones (incluyendo 'centro' para asociadoDe)

    const prestadorConRelaciones = await Prestador.findByPk(
      prestador.prestadorId,
      {
        include: [
          { model: DireccionPrestador, as: "direccion" },
          { model: TelefonoPrestador, as: "telefonos" },
          { model: EmailPrestador, as: "email" },
          {
            model: Especialidad,
            as: "especialidad",
            through: { attributes: [] },
          },
          {
            model: Prestador,
            as: "centro",
            attributes: ["prestadorId", "nombre"],
          },
        ],
        transaction,
      }
    );
    await redis.del(`prestador:list:`);
    await transaction.commit();
    res.status(201).json(prestadorConRelaciones);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al crear el prestador:", error);
    res
      .status(500)
      .json({
        error: "Error al crear el prestador",
        details: error.errors || error.message,
      });
  }
};

const getPrestadores = async (_, res) => {
  try {
    const key = "prestador:list:";
    const prestadores = await Prestador.findAll({
      include: [
        { model: DireccionPrestador, as: "direccion" },
        { model: TelefonoPrestador, as: "telefonos" },
        { model: EmailPrestador, as: "email" },
        {
          model: Especialidad,
          as: "especialidad",
          through: { attributes: [] },
        },
        {
          model: Prestador,
          as: "centro",
          attributes: ["prestadorId", "nombre"],
        },
      ],
    });
    redis.set(key, JSON.stringify(prestadores), {
      EX: Number(process.env.CACHE_TTL),
    });
    res.status(200).json(prestadores);
  } catch (error) {
    console.error(`Error al obtener los prestadores: ${error}`);
    res.status(500).json({ error: "Error al obtener los prestadores" });
  }
};

const getPrestadorByPk = async (req, res) => {
  try {
    const { id } = req.params;
    const key = `prestador:${id}`;

    const prestador = await Prestador.findByPk(id, {
      include: [
        { model: DireccionPrestador, as: "direccion" },
        { model: TelefonoPrestador, as: "telefonos" },
        { model: EmailPrestador, as: "email" },
        {
          model: Especialidad,
          as: "especialidad",
          through: { attributes: [] },
        },
        {
          model: Prestador,
          as: "centro",
          attributes: ["prestadorId", "nombre"],
        },
      ],
    });

    if (!prestador) {
      return res.status(404).json({ error: "Prestador no encontrado" });
    }
    redis.set(key, JSON.stringify(prestador.toJSON()), {
      EX: Number(process.env.CACHE_TTL),
    });
    res.status(200).json(prestador.toJSON());
  } catch (error) {
    console.error(`Error al obtener el prestador: ${error}`);
    res.status(500).json({ error: "Error al obtener el prestador" });
  }
};

const deletePrestador = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Prestador.destroy({
      where: { prestadorId: id },
    });

    if (!deleted) {
      return res.status(404).json({ message: "Prestador no encontrado" });
    }
    await redis.del(`prestador:${id}`);
    await redis.del(`prestador:list:`);
    res.status(200).json({ message: "Prestador eliminado correctamente" });
  } catch (error) {
    console.error(`Error al eliminar el prestador: ${error}`);
    res.status(500).json({ error: "Error al eliminar el prestador" });
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
    especialidades,
  } = req.body;

  if (!prestadorId) {
    return res.status(400).send({
      message: "El ID del prestador es requerido",
    });
  }
  // Validacion que tenga al menos un contacto
  if (
    !Array.isArray(telefonos) ||
    telefonos.length === 0 ||
    !Array.isArray(emails) ||
    emails.length === 0 ||
    !Array.isArray(direcciones) ||
    direcciones.length === 0
  ) {
    return res
      .status(400)
      .json({
        error: "Debe incluir al menos un teléfono, un email y una dirección.",
      });
  }
  const t = await sequelize.transaction();

  try {
    // normalizar tipoPrestador
    const tipoPrestadorDB =
      tipoPrestador?.toLowerCase() === "independiente"
        ? "Independiente"
        : "Centro Médico";

    // normalizar nombre y apellido
    const nombreCompleto = req.body.nombreCompleto?.trim?.() || "";
    const parts = nombreCompleto.split(/\s+/).filter((p) => p.length > 0);
    const nombreValido = parts[0] || nombre?.trim?.() || "";
    const apellidoValido =
      parts.slice(1).join(" ") || apellido?.trim?.() || ".";

    await Prestador.update(
      {
        nombre: nombreValido,
        apellido: apellidoValido,
        cuilCuit: cuilCuit || null,
        tipoPrestador: tipoPrestadorDB,
        asociadoDe: asociadoDe || null,
      },
      { where: { prestadorId }, transaction: t }
    );

    // emails
    await EmailPrestador.destroy({ where: { prestadorId }, transaction: t });
    if (emails?.length) {
      const nuevosEmails = emails
        .map((e) =>
          typeof e === "string"
            ? (e || "").trim()
            : (e?.descripcion || "").trim()
        ) 
        .filter((e) => e)
        .map((descripcion) => ({ descripcion, prestadorId }));
      if (nuevosEmails.length)
        await EmailPrestador.bulkCreate(nuevosEmails, { transaction: t });
    }

    // telefonos
    await TelefonoPrestador.destroy({ where: { prestadorId }, transaction: t });
    if (telefonos?.length) {
      const nuevosTelefonos = telefonos
        .map((t) =>
          typeof t === "string"
            ? (t || "").trim()
            : (t?.nroTelefono || "").trim()
        ) 
        .filter((t) => t)
        .map((nroTelefono) => ({ nroTelefono, prestadorId }));
      if (nuevosTelefonos.length)
        await TelefonoPrestador.bulkCreate(nuevosTelefonos, { transaction: t });
    }

    // direcciones

    //Busco las direcciones a eliminar
    const direccionesDelPrestador = await DireccionPrestador.findAll({where:{prestadorId}}, t) //Obtengo todas las direcciones del prestador
    const direccionesMapeadas = direccionesDelPrestador.map(d=>d.toJSON()) //Transformo a un array de objetos para poder manipular
    //Obtengo las ids de las direcciones enviadas del front
    const idsExistentes = direcciones
      .map(d => Number(d.direccionId))
      .filter(d => d!==-1);
    //Filtro las direcciones actuales del backend y solo dejo las que no coincidan 
    const direccionesAEliminar = direccionesMapeadas.filter(d=> !idsExistentes.includes(Number(d.direccionId))) //Obtengo las direcciones a eliminar


    //Elimino las direcciones
    for(dir of direccionesAEliminar){
      await DireccionPrestador.destroy({where: {direccionId: dir.direccionId}})
    }

    //Obtengo las direcciones a agregar
    const direccionesAAgregar = direcciones.filter(d=>d.direccionId ===-1).map(d=>(
      {
        calle:d.calle,
        nro: d.nro === '' ? null : d.nro,
        codigoPostal: d.codigoPostal,
        prestadorId:prestadorId
      })
    )
    if (direccionesAAgregar.length>0) {
      await DireccionPrestador.bulkCreate(direccionesAAgregar, {
        transaction: t,
      });
    }

    // especialidades

    //Obtengo las especialidades
    const especialidadesDelPrestador = await Prestador.findByPk(prestadorId, {
      include:[{
        model:Especialidad,
        as:'especialidad',
        transaction:t
      }]
    })
    //Mapeo las especialidades
    const especialidadesDelPrestadorMapeada = especialidadesDelPrestador?.especialidad.map(e => e.toJSON())
 
    //Obtengo los ids de las especialidades del front
    const idsDelFront = especialidades

    //Obtengo las especialidades a eliminar
    const especialidadesAEliminar = especialidadesDelPrestadorMapeada.filter(e=> !idsDelFront.includes(e.especialidadId))

    //Elimino
    for(esp of especialidadesAEliminar){
      await PrestadorEspecialidad.destroy({
        where:{
          prestadorId:prestadorId,
          especialidadId: esp.especialidadId
        }
      })
    }
    await especialidadesDelPrestador.reload() //Recargo especialidades

    //Obtengo las ids de las especialidades que ya estan cargadas en el prestador
    const idsDeEspecialidadesGuardadas = especialidadesDelPrestador.especialidad.map(e=>e.toJSON()).map(e=>e.especialidadId)

    //Filtro las ids que tengo que agregar
    const idsAgregar = idsDelFront.filter(id => !idsDeEspecialidadesGuardadas.includes(id))

    for(idEs of idsAgregar){
      await PrestadorEspecialidad.create({
        prestadorId:prestadorId,
        especialidadId:idEs
      })
    }

    await redis.del(`prestador:${prestadorId}`);
    await redis.del(`prestador:list:`);
    await t.commit();

    res
      .status(200)
      .send({ message: "Prestador actualizado correctamente.", prestadorId });
  } catch (error) {
    await t.rollback();
    console.error("Error al actualizar el prestador:", error);
    res.status(500).send({
      message: "Error al guardar los cambios del prestador.",
      details: error.message,
    });
  }
};

// obtener prestadores por período
const getPrestadoresPorPeriodo = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta } = req.query;

    // Validación de fechas
    if (!fechaDesde || !fechaHasta) {
      return res
        .status(400)
        .json({ error: "fechaDesde y fechaHasta son requeridos" });
    }
    const key = `prestador:list:periodo:${fechaDesde}:${fechaHasta}`;
    const desde = new Date(fechaDesde);
    const hasta = new Date(fechaHasta);

    if (isNaN(desde.getTime()) || isNaN(hasta.getTime()) || desde > hasta) {
      return res.status(400).json({ error: "Fechas inválidas" });
    }

    const prestadoresFiltrados = await Prestador.findAll({
      where: {
        fechaAlta: {
          [Op.between]: [fechaDesde, fechaHasta],
        },
      },
    });
    redis.set(key, JSON.stringify(prestadoresFiltrados), {
      EX: Number(process.env.CACHE_TTL),
    });
    res.json(prestadoresFiltrados);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener los prestadores por período" });
  }
};

const getPrestadoresPorEspecialidad = async (req, res) => {
  try {
    const { especialidadId } = req.params;

    if (!especialidadId) {
      return res.status(400).json({ error: "especialidadId es requerido" });
    }

    const key = `prestador:list:especialidad:${especialidadId}`;

    const prestadores = await Prestador.findAll({
      attributes: ['prestadorId', 'nombre', 'apellido', 'tipoPrestador'],
      include: [
        {
          model: Especialidad,
          as: "especialidad",
          through: { attributes: [] },
          where: { especialidadId: especialidadId }
        },
      ],
    });

    redis.set(key, JSON.stringify(prestadores), {
      EX: Number(process.env.CACHE_TTL),
    });

    res.status(200).json(prestadores);
  } catch (error) {
    console.error(`Error al obtener prestadores por especialidad: ${error}`);
    res.status(500).json({ error: "Error al obtener prestadores por especialidad" });
  }
};

const getPrestadoresPorCodigoPostal = async (req, res) => {
  try {
    const { codigoPostal } = req.params;

    if (!codigoPostal) {
      return res.status(400).json({ error: "codigoPostal es requerido" });
    }

    const key = `prestador:list:codigoPostal:${codigoPostal}`;

    const prestadores = await Prestador.findAll({
      attributes: ['prestadorId', 'nombre', 'apellido', 'tipoPrestador'],
      include: [
        {
          model: DireccionPrestador,
          as: "direccion",
          attributes: ['calle', 'nro', 'codigoPostal'],
          where: { codigoPostal: codigoPostal }
        },
      ],
    });

    redis.set(key, JSON.stringify(prestadores), {
      EX: Number(process.env.CACHE_TTL),
    });

    res.status(200).json(prestadores);
  } catch (error) {
    console.error(`Error al obtener prestadores por código postal: ${error}`);
    res.status(500).json({ error: "Error al obtener prestadores por código postal" });
  }
};

const getPrestadoresSinAgenda = async (req, res) => {
  try {
    const key = `prestador:list:sin-agenda`;

    // Obtener todos los prestadores que NO tienen agendas
    const prestadores = await Prestador.findAll({
      attributes: ['prestadorId', 'nombre', 'apellido', 'tipoPrestador'],
      include: [
        {
          model: DireccionPrestador,
          as: "direccion",
          attributes: ['calle', 'nro', 'codigoPostal'],
        },
        {
          model: Agenda,
          as: "agendas",
          attributes: [],
          required: false,
        }
      ],
      where: {
        '$agendas.agendaId$': null // Filtrar solo los que NO tienen agendas
      }
    });

    redis.set(key, JSON.stringify(prestadores), {
      EX: Number(process.env.CACHE_TTL),
    });

    res.status(200).json(prestadores);
  } catch (error) {
    console.error(`Error al obtener prestadores sin agenda: ${error}`);
    res.status(500).json({ error: "Error al obtener prestadores sin agenda" });
  }
};

module.exports = {
  getPrestadores,
  getPrestadorByPk,
  createPrestador,
  deletePrestador,
  updatePrestador,
  getPrestadoresPorPeriodo,
  getPrestadoresPorEspecialidad,
  getPrestadoresPorCodigoPostal,
  getPrestadoresSinAgenda
};
