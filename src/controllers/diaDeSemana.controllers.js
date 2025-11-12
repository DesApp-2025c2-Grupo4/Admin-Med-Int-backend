const { DiaDeSemana } = require("../db/models");

const getDias = async (_, res) => {
  try {
    const dias = await DiaDeSemana.findAll()
    res.status(200).json(dias);
  } catch (error) {
    console.error("Error al obtener los dias de semana", error);
    res.status(500).json({
      message: "Error en el servidor al obtener los dias de semana.",
      details: error.message,
    });
  }
};

module.exports = { getDias }