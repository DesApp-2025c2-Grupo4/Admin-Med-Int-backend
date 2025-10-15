const { Persona } = require('../db/models');

//Get
const getPersonas = async (_, res) => {
    try {
        const personas = await Persona.findAll(
             /*{
                include: [
                    Esto para cuando se hagan las demas tablas ;)
                    {
                        model: Telefono
                    },
                    { 
                        model: Direccion
                    },
                    {
                        model: SituacionesTerapeuticas
                    },
                    {
                        model: Email
                    }
                ]
            } */
        )
        res.status(200).json(personas);
    } catch (error) {
        console.error(`Error al obtener todas las personas: ${error}`);
        res.status(500).json({ error: "Error al obtener todas las personas" });
    }
}

// Post
const createPersona = async (req, res) => {
    try {
        const newPersona = req.body;
        const personaCreated = await Persona.create(newPersona);
        res.status(200).json(personaCreated);
    } catch (error) {
        console.error(`Error al crear una persona: ${error}`);
        res.status(500).json({message: 'Error en el servidor al crear una persona'})
    }
}

// Eliminar

const deletePersona = async (req, res) => {
    try {
        const { id } = req.params; 
        const deleted = await Persona.destroy({
            where: { id: id }
        });

        res.status(200).json({ message: 'Persona eliminada correctamente' });
    } catch (error) {
        console.error(`Error al eliminar la persona: ${error}`);
        res.status(500).json({ message: 'Error al eliminar la persona' });
    }
};

module.exports = { getPersonas, createPersona, deletePersona };