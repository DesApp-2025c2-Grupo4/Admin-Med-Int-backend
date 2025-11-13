const { TelefonoPrestador, Prestador} = require('../db/models');
const redis = require('../db/config/redis.js')
const dotenv = require("dotenv");
dotenv.config();
const addTelefonoToPrestador = async (req, res) => {
    const { nroTelefono } = req.body; 
    const prestadorId = req.params.prestadorId; 
    try {
        const nuevoTelefono = await TelefonoPrestador.create({
            nroTelefono: nroTelefono,
            prestadorId: prestadorId 
        });
        // Borra caché de Prestador individual
        await redis.del(`prestador:${prestadorId}`);
        // Borrarcaché de la lista de teléfonos
        await redis.del(`prestadorTelefonos:list:${prestadorId}`);

        res.status(201).json(nuevoTelefono);

    } catch (error) {
        console.error('Error al agregar el teléfono al prestador:', error);
        res.status(500).json({ 
            message: "Error en el servidor al agregar el teléfono.",
            details: error.message
        });
    }
};


const getTelefonosByPrestador = async (req, res) => {
    const prestadorId = req.params.prestadorId; 
    const key = `prestadorTelefonos:list:${prestadorId}`;
    try {
        const telefonos = await TelefonoPrestador.findAll({
            where: { prestadorId: prestadorId },
        });

        if (telefonos.length === 0) {
             const prestadorExiste = await Prestador.findByPk(prestadorId);
             if (!prestadorExiste) {
                 return res.status(404).json({ message: `Prestador con ID ${prestadorId} no encontrado.` });
             }
        }
        redis.set(key, JSON.stringify(telefonos), {
          EX: Number(process.env.CACHE_TTL),
        });
        res.status(200).json(telefonos);

    } catch (error) {
        console.error('Error al obtener los teléfonos:', error);
        res.status(500).json({ 
            message: "Error en el servidor al obtener los teléfonos.",
            details: error.message
        });
    }
};


const deleteTelefonoPrestador = async (req, res) => {
    const telefonoId = req.params.telefonoId; 
    try {
        const deletedRows = await TelefonoPrestador.destroy({
            where: { telefonoId: telefonoId }
        });
        if (deletedRows === 0) {
            return res.status(404).json({ message: `Teléfono con ID ${telefonoId} no encontrado.` });
        }
        const prestadorId = telefonoAEliminar.prestadorId;
        await redis.del(`prestador:${prestadorId}`);
        await redis.del(`prestadorTelefonos:list:${prestadorId}`);
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
    addTelefonoToPrestador,
    getTelefonosByPrestador,
    deleteTelefonoPrestador
};