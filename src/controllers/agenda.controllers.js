const { Agenda, AgendaDia, Horario, DiaDeSemana } = require("../db/models");
const { sequelize } = require("../db/models");
const redis = require('../db/config/redis.js')

const getAgendas = async (req, res) => {
  const key = 'agenda:list';
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
      ],
    });
    if (agendas.length > 0) {
      const dataToCache = JSON.stringify(agendas); 
      await redis.set(key, dataToCache, { EX: 3600 }); 
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
    console.log(agendaCreada)
    for (const a of body.agendas){
      const diaAgenda = await AgendaDia.create(
        { agendaId: agendaCreada.agendaId, idDia: a.idDia },
        { transaction }
      );

      const horarios = a.horarios.map((h) => {
        return { ...h, agendaDiaId: diaAgenda.agendaDiaId };
      });

      await Horario.bulkCreate(horarios, { transaction });
    };

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

module.exports = {
  getAgendas,
  createAgenda,
  eliminarUnaAgenda
};
