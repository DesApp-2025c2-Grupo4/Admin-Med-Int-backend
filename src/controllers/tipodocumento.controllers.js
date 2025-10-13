const { TipoDocumento } = require("../db/models");

// Post
const createTipoDoc = async (req, res) => {
    try {
        const newTipoDoc = req.body;
        const tipoDocCreated = await TipoDocumento.create(newTipoDoc);
        res.status(200).json(tipoDocCreated);
  } catch (error) {
        console.error(`Error al crear un tipo de documento: ${error}`);
        res.status(500).json({ message: "Error en el servidor al crear un tipo de documento" });
  }
};

module.exports = { createTipoDoc };
