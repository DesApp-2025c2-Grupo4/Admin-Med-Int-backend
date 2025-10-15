const { Direccion } = require('../db/models'); 

const addDireccionToPersona = async (req, res) => {
    const { calle, nro } = req.body; 
    const personaId = req.params.personaId; 
    try {
        const nuevaDireccion = await Direccion.create({
            calle: calle,
            nro: nro,
            personaId: personaId 
        });
        res.status(201).json(nuevaDireccion);
        
    } catch (error) {
        console.error('Error al agregar la dirección a la persona:', error);
        res.status(500).json({ 
            message: "Error en el servidor al agregar la dirección.",
            details: error.message
        });
    }
};

const getDireccionesByPersona = async (req, res) => {
    const personaId = req.params.personaId; 
    try {
        const direcciones = await Direccion.findAll({
            where: { personaId: personaId },
        });
        res.status(200).json(direcciones);

    } catch (error) {
        console.error('Error al obtener las direcciones:', error);
        res.status(500).json({ 
            message: "Error en el servidor al obtener las direcciones.",
            details: error.message
        });
    }
};

const deleteDireccion = async (req, res) => {
    const direccionId = req.params.direccionId; 
    try {
        const deletedRows = await Direccion.destroy({
            where: { direccionId: direccionId }
        });

        if (deletedRows === 0) {
            return res.status(404).json({ message: `Dirección con ID ${direccionId} no encontrada.` });
        }

        res.status(204).send(); 
    } catch (error) {
        console.error('Error al eliminar la dirección:', error);
        res.status(500).json({ 
            message: "Error en el servidor al eliminar la dirección.",
            details: error.message
        });
    }
};

module.exports = {
    addDireccionToPersona,
    getDireccionesByPersona,
    deleteDireccion
};