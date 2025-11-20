const {
  Agenda,
  AgendaDia,
  Horario,
  DiaDeSemana,
  Prestador,
  Especialidad,
  DireccionPrestador,
  TelefonoPrestador
} = require("../db/models");
const { sequelize } = require("../db/models");
const redis = require("../db/config/redis.js");
const dotenv = require("dotenv");
dotenv.config();
const getAgendas = async (req, res) => {
  const key = "agenda:list";
  try {
    const agendas = await Agenda.findAll({
      include: [
        {
          model: AgendaDia,
          as: "agendas",
          include: [
            { model: Horario, as: "horarios" },
            { model: DiaDeSemana, as: "dia" },
          ],
        },
        {
          model: Prestador,
          as: "prestador",
          include: [{ model: TelefonoPrestador, as: "telefonos" }]
        },
        {
          model: Especialidad,
          as: "especialidad",
        },
        {
          model: DireccionPrestador,
          as: "direccion",
        },
      ],
    });
    if (agendas.length > 0) {
      const dataToCache = JSON.stringify(agendas);
      await redis.set(key, dataToCache, {EX: Number(process.env.CACHE_TTL)});
    }
    res.status(200).json(agendas);
  } catch (error) {
    console.error(`Error al obtener todas las agendas: ${error}`);
    res.status(500).json({ message: "Error al obtener las agendas" });
  }
};

const createAgenda = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { body } = req;
    const newAgenda = {
      prestadorId: body.prestadorId,
      especialidadId: body.especialidadId,
      direccionId: body.direccionId,
    };
    const agendaCreada = await Agenda.create(newAgenda, { transaction });
    console.log(agendaCreada);
    for (const a of body.agendas) {
      const diaAgenda = await AgendaDia.create(
        { agendaId: agendaCreada.agendaId, idDia: a.idDia },
        { transaction }
      );

      const horarios = a.horarios.map((h) => {
        return { ...h, agendaDiaId: diaAgenda.agendaDiaId };
      });

      await Horario.bulkCreate(horarios, { transaction });
    }

    const nuevaAgenda = await agendaCreada.reload({
      include: [
        {
          model: AgendaDia,
          as: "agendas",
          include: [
            { model: Horario, as: "horarios" },
            { model: DiaDeSemana, as: "dia" },
          ],
        },
      ],
      transaction,
    });
    await transaction.commit();
    await redis.del(`agenda:list`);
    res.json(nuevaAgenda);
    
      
  } catch (error) {
    await transaction.rollback();
    console.error("Error al crear agenda:", error);
    res.status(500).json({ message: "Error en el servidor al crear agenda" });
  }
};

const eliminarUnaAgenda = async (req, res) => {
  const { id } = req.params;
  try {
    const agendaDelete = await Agenda.destroy({
      where: {
        agendaId: id,
      },
    });
    
      await redis.del(`agenda:${id}`);
      await redis.del(`agenda:list`);
    if (agendaDelete === 1) {
      res.status(200).json(agendaDelete);
    } else {
      res.status(404).json({ error: "No se encontró la agenda a eliminar" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error al eliminar la agenda" });
  }
};

const getAgendaById = async (req, res) => {
  const { id } = req.params;
  try {
    const agenda = await Agenda.findByPk(id, {
    include: [
        {
          model: AgendaDia,
          as: "agendas",
          include: [
            { model: Horario, as: "horarios" },
            { model: DiaDeSemana, as: "dia" },
          ],
        },
        
        // 2. INCLUSIÓN DE Prestador (Nivel 1, al mismo nivel que AgendaDia)
        {
          model: Prestador,
          as: "prestador", 
          // Asegúrate de que el alias 'prestador' coincida con tu asociación en el modelo Agenda
          include: [{ model: TelefonoPrestador, as: "telefonos" }] 
        },
        // 3. Opcional: Incluir Especialidad y Dirección al mismo nivel
        {
          model: Especialidad,
          as: "especialidad",
        },
        {
          model: DireccionPrestador,
          as: "direccion",
        },
      ],
    });

    if (!agenda) {
      return res.status(404).json({ message: "Agenda no encontrada" });
    }

    res.status(200).json(agenda);
  } catch (error) {
    console.error("Error al obtener la agenda por ID:", error);
    res
      .status(500)
      .json({ message: "Error en el servidor al obtener la agenda" });
  }
};

const updateAgenda = async (req, res) => {
  const { id } = req.params;
  const { prestadorId, especialidadId, direccionId, agendas } = req.body;

  const transaction = await sequelize.transaction();

  try {
    const agendaExistente = await Agenda.findByPk(id, { transaction });

      await redis.del(`agenda:${id}`);
      await redis.del(`agenda:list`);
    if (!agendaExistente) {
      await transaction.rollback();
      return res.status(404).json({ message: "Agenda no encontrada" });
    }

    // Actualizar datos principales de la agenda
    await agendaExistente.update(
      { prestadorId, especialidadId, direccionId },
      { transaction }
    );

    // Eliminar días y horarios anteriores
    const diasAnteriores = await AgendaDia.findAll({
      where: { agendaId: id },
      transaction,
    });

    for (const dia of diasAnteriores) {
      await Horario.destroy({
        where: { agendaDiaId: dia.agendaDiaId },
        transaction,
      });
      await dia.destroy({ transaction });
    }

    // Crear nuevos días y horarios
    for (const a of agendas) {
      const nuevoDia = await AgendaDia.create(
        { agendaId: id, idDia: a.idDia },
        { transaction }
      );

      const nuevosHorarios = a.horarios.map((h) => ({
        ...h,
        agendaDiaId: nuevoDia.agendaDiaId,
      }));

      await Horario.bulkCreate(nuevosHorarios, { transaction });
    }

    const agendaActualizada = await Agenda.findByPk(id, {
      include: [
        {
          model: AgendaDia,
          as: "agendas",
          include: [
            { model: Horario, as: "horarios" },
            { model: DiaDeSemana, as: "dia" },
          ],
        },
      ],
      transaction,
    });

    await transaction.commit();
    res.status(200).json(agendaActualizada);
  } catch (error) {
    await transaction.rollback();
    console.error("Error al actualizar agenda:", error);
    res.status(500).json({ message: "Error al actualizar la agenda" });
  }
};

module.exports = {
  getAgendas,
  createAgenda,
  eliminarUnaAgenda,
  getAgendaById,
  updateAgenda,
};
