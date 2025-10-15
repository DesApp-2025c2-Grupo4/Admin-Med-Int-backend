const { Persona, Grupo, PlanMedico } = require("../db/models");

//Get
const getPersonas = async (_, res) => {
  try {
    const personas = await Persona.findAll({
      include: [
        {
          model: Grupo,
          include: [
            {
              model: PlanMedico,
            },
          ],
        },
        /*,
                    {
                        model: SituacionesTerapeuticas
                    },
                    {
                        model: Email
                    } */
      ],
    });
    res.status(200).json(personas);
  } catch (error) {
    console.error(`Error al obtener todas las personas: ${error}`);
    res.status(500).json({ error: "Error al obtener todas las personas" });
  }
};

// Post
const createPersona = async (req, res) => {
  try {
    const newPersona = req.body;
    const personaCreated = await Persona.create(newPersona);
    res.status(200).json(personaCreated);
  } catch (error) {
    console.error(`Error al crear una persona: ${error}`);
    res
      .status(500)
      .json({ message: "Error en el servidor al crear una persona" });
  }
};

module.exports = { getPersonas, createPersona };
