const { Persona, Grupo, PlanMedico, Telefono, Email, Direccion, SituacionesTerapeuticas } = require('../db/models');
const {formatearSituaciones} = require('../utils/formatearSituaciones')
//----------------------------GETTERS
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
        {
          model: Email,
          as: 'email'
        }
      ],
    });
    res.status(200).json(personas);
  } catch (error) {
    console.error(`Error al obtener todas las personas: ${error}`);
    res.status(500).json({ error: "Error al obtener todas las personas" });
  }
};
//Obtener una persona
const getPersonaByPk = async (req,res)=>{
  try {
    const {id} = req.params
    //Busco la persona
    const personaBuscada = await Persona.findByPk(
      id,{
        include:[
          {
            model: SituacionesTerapeuticas,
            as: 'situacionesTerapeuticas',
          },{
            model:Telefono,
            as: 'telefonos'
          },{
            model:Email,
            as:'email'
          },{
            model:Direccion,
            as:'direcciones'
          }
        ]
      }
    )
    //Formateo las situaciones
    const personaFormateada = {
      ... personaBuscada.toJSON(),
      situacionesTerapeuticas: formatearSituaciones(personaBuscada.situacionesTerapeuticas)
    }

    //Retorno
    res.json(personaFormateada)
  } catch (error) {
    console.error(`Error al obtener la persona: ${error}`);
    res.status(500).json({ error: "Error al obtener una Persona" });
  }
}
//----------------------------- Post
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

const deletePersona = async (req, res) => {
    try {
        const { id } = req.params; 
        const deleted = await Persona.destroy({
            where: { personaId: id }
        });

        //que pasa con la persona si no la encuentra? AGREGAR

        res.status(200).json({ message: 'Persona eliminada correctamente' });
    } catch (error) {
        console.error(`Error al eliminar la persona: ${error}`);
        res.status(500).json({ message: 'Error al eliminar la persona' });
    }
};

module.exports = { 
  getPersonas, 
  createPersona, 
  deletePersona,
  getPersonaByPk 
};
