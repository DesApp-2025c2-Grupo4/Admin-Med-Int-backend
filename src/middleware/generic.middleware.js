const requireAttribute = (attributeName, modelName) => (req, res, next) => {
    const value = req.body[attributeName];

    if (value === null || value === undefined) {
        return res.status(400).json({ 
            message: `El campo '${attributeName}' es requerido para ${modelName}.` 
        });
    }
    if (typeof value === 'string' && value.trim().length === 0) {
        return res.status(400).json({ 
            message: `El campo '${fieldName}' de ${modelName} no puede estar vacío.` 
        });
    }

    next();
};

const ifPersonaExists = async (req, res, next) => {
    const personaId = req.params.personaId;
    if (!personaId) {
        return res.status(500).json({ message: "Error de configuración de la ruta: Falta :personaId." });
    }
    try {
        const persona = await Persona.findByPk(personaId);

        if (!persona) {
            return res.status(404).json({ 
                message: `No se encontró la Persona con ID ${personaId}.` 
            });
        }
        req.persona = persona;
        next();
    } catch (error) {
        console.error('Error al verificar la existencia de Persona:', error);
        res.status(500).json({ 
            message: "Error en el servidor al verificar el recurso.",
            details: error.message
        });
    }
};
module.exports = { requireAttribute, ifPersonaExists };