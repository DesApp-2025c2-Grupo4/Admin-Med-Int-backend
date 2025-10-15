const { PlanMedico } = require('../db/models'); 

const createPlanMedico = async (req, res) => {
    try {
        const { descripcion } = req.body;
        const nuevoPlan = await PlanMedico.create({
            descripcion: descripcion
        });
        res.status(201).json(nuevoPlan);
    } catch (error) {
        console.error('Error al crear un Plan Médico:', error);
        res.status(500).json({ 
            message: "Error en el servidor al crear el Plan Médico.",
            details: error.message
        });
    }
};

const getPlanesMedicos = async (req, res) => {
    try {
        const planesMedicos = await PlanMedico.findAll({
            attributes: ['planId', 'descripcion'] 
        });
        res.status(200).json(planesMedicos);
        
    } catch (error) {
        console.error('Error al obtener los planes médicos:', error);
        res.status(500).json({ 
            message: "Error en el servidor al obtener los planes médicos.",
            details: error.message
        });
    }
};

module.exports = { getPlanesMedicos, createPlanMedico };