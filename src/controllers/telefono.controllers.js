const { Telefono, Persona } = require('../db/models');
const redis = require("../db/config/redis.js")

const addTelefonoToPersona = async (req, res) => {
    const { nroTelefono } = req.body; 
    const personaId = req.params.personaId; 
    try {
        const nuevoTelefono = await Telefono.create({
            nroTelefono: nroTelefono,
            personaId: personaId 
        });
        await redis.del(`persona:${personaId}`);
        // Borra caché de Persona individual
        await redis.del(`persona:${personaId}`);
        // Borra caché de la lista de teléfonos
        await redis.del(`personaTelefonos:list:${personaId}`);
        res.status(201).json(nuevoTelefono);

    } catch (error) {
        console.error('Error al agregar el teléfono a la persona:', error);
        res.status(500).json({ 
            message: "Error en el servidor al agregar el teléfono.",
            details: error.message
        });
    }
};


const getTelefonosByPersona = async (req, res) => {
    const personaId = req.params.personaId; 
    const key = `personaTelefonos:list:${personaId}`;
    try {
        const telefonos = await Telefono.findAll({
            where: { personaId: personaId },
        });

        if (telefonos.length === 0) {
             const personaExiste = await Persona.findByPk(personaId);
             if (!personaExiste) {
                 return res.status(404).json({ message: `Persona con ID ${personaId} no encontrada.` });
             }
        }
        await redis.set(key, JSON.stringify(telefonos), { EX: 900 });
        res.status(200).json(telefonos);

    } catch (error) {
        console.error('Error al obtener los teléfonos:', error);
        res.status(500).json({ 
            message: "Error en el servidor al obtener los teléfonos.",
            details: error.message
        });
    }
};

const updateTelefono = async (req, res) => {
    const {id} = req.params; 
    const body = req.body
    try {
        const telefonoAEditar = await Telefono.findByPk(id)
        telefonoAEditar.nroTelefono = body.nroTelefono
        //Guardo
        await telefonoAEditar.save()
        //Recargo
        await telefonoAEditar.reload()
        const personaId = telefonoAEditar.personaId;
        await redis.del(`persona:${personaId}`);
        await redis.del(`personaTelefonos:list:${personaId}`);
        res.status(200).json(telefonoAEditar); 
    } catch (error) {
        console.error('Error al editar el teléfono:', error);
        res.status(500).json({ 
            message: "Error en el servidor al editar el teléfono.",
            details: error.message
        });
    }
};

const deleteTelefono = async (req, res) => {
    const telefonoId = req.params.telefonoId; 
    try {
        const telefonoEliminado = await Telefono.findByPk(telefonoId)
        const deletedRows = await Telefono.destroy({
            where: { telefonoId: telefonoId }
        });
        if (deletedRows === 0) {
            return res.status(404).json({ message: `Teléfono con ID ${telefonoId} no encontrado.` });
        }
        const personaId = telefonoEliminado.personaId;
        await redis.del(`persona:${personaId}`);
        await redis.del(`personaTelefonos:list:${personaId}`);
        res.status(200).json(telefonoEliminado); 
    } catch (error) {
        console.error('Error al eliminar el teléfono:', error);
        res.status(500).json({ 
            message: "Error en el servidor al eliminar el teléfono.",
            details: error.message
        });
    }
};

module.exports = {
    addTelefonoToPersona,
    getTelefonosByPersona,
    deleteTelefono,
    updateTelefono
};