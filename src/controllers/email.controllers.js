const { Email, Persona } = require('../db/models');

const addEmailToPersona = async (req, res) => {
    const { descripcion } = req.body; 
    const personaId = req.params.personaId; 
    try {
        const nuevoEmail = await Email.create({
            descripcion: descripcion,
            personaId: personaId 
        }); 
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
        const deletedRows = await Email.destroy({
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
    addEmailToPersona,
    getEmailsByPersona,
    deleteEmail
};