const { Persona, SituacionesTerapeuticas } = require('../db/models'); 
const KEY_PERSONA = (id) => `persona:${id}`;
const KEY_SITUACIONES_LIST = (id) => `personaSituaciones:list:${id}`;
const redis = require("../db/config/redis.js");

const addSituacionToPersona = async (req, res) => {
    const personaId = req.params.personaId; 
    const situacionId = req.params.situacionId;
    try {
        const persona = await Persona.findByPk(personaId); 
        const situacion = await SituacionesTerapeuticas.findByPk(situacionId);
        if (!situacion) {
            return res.status(404).json({ message: `Situación con ID ${situacionId} no encontrada.` });
        }
        await persona.addSituacionesTerapeuticas(situacion); 
        await redis.del(KEY_PERSONA(personaId));
        await redis.del(KEY_SITUACIONES_LIST(personaId));
        res.status(200).json({ message: "Situación añadida con éxito." });
    } catch (error) {
        console.error('Error al añadir situación:', error);
        res.status(500).json({ message: "Error al gestionar la relación." });
    }
};

const getSituacionesByPersona = async (req, res) => {
    const personaId = req.params.personaId; 
    const key = KEY_SITUACIONES_LIST(personaId);
    try {
        const persona = await Persona.findByPk(personaId); 
        const situaciones = await persona.getSituacionesTerapeuticas({
        });
        if (situaciones.length > 0) {
            await redis.set(key, JSON.stringify(situaciones), { EX: process.env.CACHE_TTL });
        }
        res.status(200).json(situaciones);
    } catch (error) {
        console.error('Error al listar situaciones:', error);
        res.status(500).json({ message: "Error al listar las situaciones de la persona." });
    }
};


const deleteSituacionFromPersona = async (req, res) => {
    const personaId = req.params.personaId; 
    const situacionId = req.params.situacionId;
    try {
        const persona = await Persona.findByPk(personaId);
        const situacion = await SituacionesTerapeuticas.findByPk(situacionId);
        if (!situacion) {
            return res.status(404).json({ message: `Situación con ID ${situacionId} no encontrada.` });
        }
        await persona.removeSituacionesTerapeuticas(situacion); 
        await redis.del(KEY_PERSONA(personaId));
        await redis.del(KEY_SITUACIONES_LIST(personaId));
        res.status(204).send();

    } catch (error) {
        console.error('Error al eliminar relación:', error);
        res.status(500).json({ message: "Error al desasociar la situación." });
    }
};

module.exports = {
    addSituacionToPersona,
    getSituacionesByPersona,
    deleteSituacionFromPersona
};