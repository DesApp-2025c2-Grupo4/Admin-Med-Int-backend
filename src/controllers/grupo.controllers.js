const { Grupo } = require("../db/models");

//Get

const getGrupos = async (_, res) => {
  try {
    const grupos = await Grupo.findAll({
      include: [
        {
          model: PlanMedico, 
          as: "planMedico", 
        },
      ],
    });

    res.status(200).json(grupos);
  } catch (error) {
    console.error(`Error al obtener todos los grupos: ${error}`);
    res.status(500).json({ error: "Error al obtener todos los grupos" });
  }
};

//Post

const createGrupo = async (req, res) => {
  try {
    const newGrupo = req.body;
    const grupoCreated = await Grupo.create(newGrupo);
    res.status(200).json(grupoCreated);
  } catch (error) {
    console.error(`Error al crear un grupo: ${error}`);
    res.status(500).json({ message: "Error en el servidor al crear un grupo" });
  }
};

module.exports = { createGrupo, getGrupos };
