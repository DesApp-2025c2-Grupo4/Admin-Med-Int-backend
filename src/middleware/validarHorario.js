const { Agenda, AgendaDia, Horario } = require("../db/models");
const { Op } = require("sequelize");

const validarHorario = async (req, res, next) => {
  try {
    const { prestadorId, agendas } = req.body;

    if (!prestadorId || !Array.isArray(agendas) || agendas.length === 0) {
      return res.status(400).json({ message: "Datos inválidos." });
    }

    // Extraer lista de días enviados
    const diasEnviados = agendas.map(a => a.idDia);

    // Buscar agendas existentes del prestador en esos días
    const conflictivas = await Agenda.findAll({
      where: { prestadorId },
      include: [
        {
          model: AgendaDia,
          as: "agendas",
          where: { idDia: { [Op.in]: diasEnviados } },
          include: [
            { model: Horario, as: "horarios" }
          ]
        }
      ]
    });

    if (conflictivas.length > 0) {
      return res.status(400).json({
        message: "El prestador ya tiene una agenda asignada en uno de los días enviados."
      });
    }

    // Validar superposición de horarios dentro del request (ej: 08:00-12:00 vs 11:00-14:00)
    for (const dia of agendas) {
      const horarios = dia.horarios;

      for (let i = 0; i < horarios.length - 1; i++) {
        for (let j = i + 1; j < horarios.length; j++) {

          const h1 = horarios[i];
          const h2 = horarios[j];

          const solapa =
            h1.horaInicio < h2.horaFin &&
            h2.horaInicio < h1.horaFin;

          if (solapa) {
            return res.status(400).json({
              message: `Hay superposición de horarios en el día ${dia.idDia}.`
            });
          }
        }
      }
    }

    next();

  } catch (error) {
    console.error("Error en validarHorario:", error);
    return res.status(500).json({ message: "Error al validar horarios." });
  }
};

module.exports = validarHorario;