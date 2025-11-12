const { TipoDocumento } = require("../db/models");
const redis = require("../db/config/redis.js");

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

const getTipoDoc = async (req, res) => {
    try {
        const key = 'tipoDoc:list';
        const tiposDocumento = await TipoDocumento.findAll({
            attributes: ['descripcion'] 
        });
        if (tiposDocumento.length > 0) {
            await redis.set(key, JSON.stringify(tiposDocumento), { EX: process.env.CACHE_TTL }); 
        }
        res.status(200).json(tiposDocumento);
    } catch (error) {
        console.error('Error al obtener los tipos de documento:', error);
        res.status(500).json({ 
            message: "Error en el servidor al obtener los tipos de documento.",
            details: error.message
        });
    }
};

module.exports = { createTipoDoc, getTipoDoc };
