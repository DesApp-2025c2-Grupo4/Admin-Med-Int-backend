const { EmailPrestador, Prestador } = require('../db/models');
const redis = require('../db/config/redis.js')

const addEmailToPrestador = async (req, res) => {
    const { descripcion } = req.body; 
    const prestadorId = req.params.prestadorId; 
    try {
        const nuevoEmail = await EmailPrestador.create({
            descripcion: descripcion,
            prestadorId: prestadorId 
        }); 
        const keyIndividual = `prestador:${prestadorId}`;
        await redis.del(keyIndividual);
        res.status(201).json(nuevoEmail);
    } catch (error) {
        console.error('Error al agregar el email al prestador:', error);
        res.status(500).json({ 
            message: "Error en el servidor al agregar el email.",
            details: error.message
        });
    }
};

const getEmailsByPrestador = async (req, res) => {
    const prestadorId = req.params.prestadorId; 
    const key = `prestadorEmails:list:${prestadorId}`;
    try {
        const emails = await EmailPrestador.findAll({
            where: { prestadorId: prestadorId },
        });
        if (emails.length === 0) {
             const prestadorExiste = await Prestador.findByPk(prestadorId);
             if (!prestadorExiste) {
                 return res.status(404).json({ message: `Prestador con ID ${prestadorId} no encontrada.` });
             }
        }
        redis.set(key, JSON.stringify(emails), { EX: 900 });
        res.status(200).json(emails);

    } catch (error) {
        console.error('Error al obtener los emails:', error);
        res.status(500).json({ 
            message: "Error en el servidor al obtener los emails.",
            details: error.message
        });
    }
};

const deleteEmailPrestador = async (req, res) => {
    const emailId = req.params.emailId; 

    try {
        const deletedRows = await EmailPrestador.destroy({
            where: { emailId: emailId }
        });
        if (deletedRows === 0) {
            return res.status(404).json({ message: `Email con ID ${emailId} no encontrado.` });
        }
        res.status(204).send(); 
    } catch (error) {
        console.error('Error al eliminar el email:', error);
        res.status(500).json({ 
            message: "Error en el servidor al eliminar el email.",
            details: error.message
        });
    }
};

module.exports = {
    addEmailToPrestador,
    getEmailsByPrestador,
    deleteEmailPrestador
};