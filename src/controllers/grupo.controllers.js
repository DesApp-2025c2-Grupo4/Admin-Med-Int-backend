const { 
  Grupo,
  Persona,
  PlanMedico,
  SituacionesTerapeuticas,
  Telefono,
  Email,
  Direccion
} = require("../db/models");
const {formatearSituaciones} = require('../utils/formatearSituaciones')
//Getters

const getGrupos = async (_, res) => {
  try {

    //Consulta a la base de datos
    const grupos = await Grupo.findAll({
      include: [
        {
          model: PlanMedico, 
          as: "planMedico", 
        },
        {
          model: Persona,
          as:'integrantes',
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
      ],
    });

    //Reconstruyo situaciones
    const gruposFormateado = grupos?.map(g => {
        return {
          ... g.toJSON(),
          integrantes: g.integrantes.map(i => {
            return {... i.toJSON(),
              situacionesTerapeuticas:formatearSituaciones(i.situacionesTerapeuticas)
            }
          })
        }
      }
    )
    //Devuelvo todos los grupos
    res.status(200).json(gruposFormateado);
  } catch (error) {
    console.error(`Error al obtener todos los grupos: ${error}`);
    res.status(500).json({ error: "Error al obtener todos los grupos" });
  }
};

//Post

const createGrupo = async (req, res) => {
  try {
    const newGrupo = req.body;
    const grupoCreated = await Grupo.create(newGrupo);
    res.status(200).json(grupoCreated);
  } catch (error) {
    console.error(`Error al crear un grupo: ${error}`);
    res.status(500).json({ message: "Error en el servidor al crear un grupo" });
  }
};

module.exports = { createGrupo, getGrupos };
