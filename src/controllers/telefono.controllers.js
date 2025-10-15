const { Telefono, Persona } = require('../db/models');

const addTelefonoToPersona = async (req, res) => {
    const { nroTelefono } = req.body; 
    const personaId = req.params.personaId; 
    try {
        const nuevoTelefono = await Telefono.create({
            nroTelefono: nroTelefono,
            personaId: personaId 
        });
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

        res.status(200).json(telefonos);

    } catch (error) {
        console.error('Error al obtener los teléfonos:', error);
        res.status(500).json({ 
            message: "Error en el servidor al obtener los teléfonos.",
            details: error.message
        });
    }
};


const deleteTelefono = async (req, res) => {
    const telefonoId = req.params.telefonoId; 
    try {
        const deletedRows = await Telefono.destroy({
            where: { telefonoId: telefonoId }
        });
        if (deletedRows === 0) {
            return res.status(404).json({ message: `Teléfono con ID ${telefonoId} no encontrado.` });
        }
        res.status(204).send(); 
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
    deleteTelefono
};