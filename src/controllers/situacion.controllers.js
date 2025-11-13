const { SituacionesTerapeuticas } = require('../db/models');
const redis = require('../db/config/redis.js')
const dotenv = require("dotenv");
dotenv.config();

const getSituaciones = async (req, res) => {
    const key = 'situacion:list';
    try {
        const situaciones = await SituacionesTerapeuticas.findAll({
            attributes: ['situacionId', 'descripcion', 'esCronica']
        });
        res.status(200).json(situaciones);
    } catch (error) {
        console.error('Error al obtener situaciones:', error);
        res.status(500).json({ message: "Error en el servidor al obtener las situaciones." });
    }
};

const createSituacion = async (req, res) => {
    const { descripcion, esCronica, fechaInicio, fechaFin } = req.body; 
    try {
        const nuevaSituacion = await SituacionesTerapeuticas.create({
            descripcion,
            esCronica,
            fechaInicio,
            fechaFin: fechaFin || null 
        });
        res.status(201).json(nuevaSituacion);
    } catch (error) {
        console.error('Error al crear situación:', error);
        res.status(400).json({ message: "Error al crear la situación terapéutica.", details: error.message });
    }
};

module.exports = {
    getSituaciones,
    createSituacion
};