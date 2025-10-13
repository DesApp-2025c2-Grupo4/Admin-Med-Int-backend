const { Grupo } = require('../db/models')

//Post

const createGrupo = async (req, res) => {
  try {
    const newGrupo = req.body;
    const grupoCreated = await Grupo.create(newGrupo);
    res.status(200).json(grupoCreated);
  } catch (error) {
    console.error(`Error al crear un grupo: ${error}`);
    res
      .status(500)
      .json({ message: "Error en el servidor al crear un grupo" });
  }
};

module.exports = { createGrupo };