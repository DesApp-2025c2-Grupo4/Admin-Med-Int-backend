const {
  Agenda,
  DiaDeSemana,
  Horario,
  Prestador,
  DireccionPrestador,
  Especialidad,
} = require("../db/models");
const getAgendas = async (_, res) => {
  try {
    const agendas = await Agenda.findAll({
      include: [
        {
          model: DiaDeSemana,
          as: "diasDeSemana",
          include: [{ model: Horario, as: "horarios" }],
        }
      ],
    });
    res.status(200).json(agendas);
  } catch (error) {
    console.error(`Error al obtener todas las agendas: ${error}`);
    res.status(500).json({ error: "Error al obtener las agendas" });
  }
};

module.exports = {
  getAgendas,
};
