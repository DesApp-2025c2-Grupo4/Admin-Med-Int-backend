const { Email, Persona } = require('../db/models');
const redis = require("../db/config/redis.js")

const addEmailToPersona = async (req, res) => {
    const { descripcion } = req.body; 
    const personaId = req.params.personaId; 
    try {
        const nuevoEmail = await Email.create({
            descripcion: descripcion,
            personaId: personaId 
        }); 
        await redis.del(`persona:${personaId}`);
        await redis.del(`personaEmails:list:${personaId}`);
        res.status(201).json(nuevoEmail);
    } catch (error) {
        console.error('Error al agregar el email a la persona:', error);
        res.status(500).json({ 
            message: "Error en el servidor al agregar el email.",
            details: error.message
        });
    }
};

const getEmailsByPersona = async (req, res) => {
    const personaId = req.params.personaId; 
    const key = `personaEmails:list:${personaId}`;
    try {
        const emails = await Email.findAll({
            where: { personaId: personaId },
        });
        if (emails.length === 0) {
             const personaExiste = await Persona.findByPk(personaId);
             if (!personaExiste) {
                 return res.status(404).json({ message: `Persona con ID ${personaId} no encontrada.` });
             }
        }
        if (emails.length > 0) {
            await redis.set(key, JSON.stringify(emails), { EX: process.env.CACHE_TTL });
        }
        res.status(200).json(emails);

    } catch (error) {
        console.error('Error al obtener los emails:', error);
        res.status(500).json({ 
            message: "Error en el servidor al obtener los emails.",
            details: error.message
        });
    }
};

const deleteEmail = async (req, res) => {
    const emailId = req.params.emailId; 

    try {
        const emailAEliminar = await Email.findByPk(emailId)
        const deletedRows = await Email.destroy({
            where: { emailId: emailId }
        });
        if (deletedRows === 0) {
            return res.status(404).json({ message: `Email con ID ${emailId} no encontrado.` });
        }
        const personaId = emailAEliminar.personaId;
        // Borrar caché de la persona individual
        await redis.del(`persona:${personaId}`);
        // Borrar caché de la lista de emails de esa persona
        await redis.del(`personaEmails:list:${personaId}`);
        res.status(200).json(emailAEliminar); 
    } catch (error) {
        console.error('Error al eliminar el email:', error);
        res.status(500).json({ 
            message: "Error en el servidor al eliminar el email.",
            details: error.message
        });
    }
};
const updateEmail = async (req, res)=>{
    const {id} = req.params; 
    const body = req.body
    try {
        const emailAEditar = await Email.findByPk(id)
        emailAEditar.descripcion = body.descripcion
        //Guardo
        await emailAEditar.save()
        //Recargo
        await emailAEditar.reload()
        const personaId = emailAEditar.personaId;
        // Borrar caché de la persona individual
        await redis.del(`persona:${personaId}`);
        // Borrar caché de la lista de emails de esa persona
        await redis.del(`personaEmails:list:${personaId}`);
        res.status(200).json(emailAEditar); 
    } catch (error) {
        console.error('Error al editar el Email:', error);
        res.status(500).json({ 
            message: "Error en el servidor al editar el Email.",
            details: error.message
        });
    }
}
module.exports = {
    addEmailToPersona,
    getEmailsByPersona,
    deleteEmail,
    updateEmail
};