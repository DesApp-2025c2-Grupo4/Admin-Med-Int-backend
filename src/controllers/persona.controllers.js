const { Persona, Grupo,SituacionPersona, PlanMedico, Telefono, Email, Direccion, SituacionesTerapeuticas,TipoDocumento } = require('../db/models');
const { crearCredencial } = require('../utils/crearCredencial');
const {formatearSituaciones} = require('../utils/formatearSituaciones')
const { sequelize } = require('../db/models');

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
          },{
            model:TipoDocumento,
            as:'tipoDocumento'
          },{
            model:Grupo,
            as:'grupo',
            include:[{
              model:PlanMedico,
              as:'planMedico'
            }
            ]
          }
        ]
      }
    )
    //Formateo las situaciones
    const personaFormateada = {
      ... personaBuscada.toJSON(),
      situacionesTerapeuticas: formatearSituaciones(personaBuscada.situacionesTerapeuticas)
    }
    //Formateo el grupo
    const grupoPeteneciente = personaFormateada.grupo
    delete personaFormateada.grupo 
    personaFormateada.nroGrupo = grupoPeteneciente.nroGrupo
    personaFormateada.planMedico = {
      planId: grupoPeteneciente.planMedico.planId,
      descripcion: grupoPeteneciente.planMedico.descripcion
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
  //Creo una transaccion en caso de que alguna consulta falle
  const transaction = await sequelize.transaction();
  try {

    //Obtengo datos del body
    const newPersona = req.body;


    //------------------- Creo la Credencial
    const grupo = await Grupo.findByPk(newPersona.idGrupo, { transaction });

    const cantidadIntegrantes = await Persona.count({
      where: { idGrupo: newPersona.idGrupo },
      transaction
    });

    const credencial = crearCredencial(grupo.nroGrupo, cantidadIntegrantes);
    
    newPersona.credencial = credencial;
    //Controlo que no sea haya o no un titular
    newPersona.esTitular = cantidadIntegrantes === 0

    
    //------------------ Creo la persona
    const personaCreated = await Persona.create(newPersona, { transaction });

    //------------------ Creo las direcciones
    const direcciones = newPersona.direcciones.map(d => {
      return {
        ...d,
        personaId: personaCreated.personaId
      };
    });

    await Direccion.bulkCreate(direcciones, { transaction });

    //------ Creo los telefonos
    const telefonos = newPersona.telefonos.map(t => {
      return {
        ...t,
        personaId: personaCreated.personaId
      };
    });

    await Telefono.bulkCreate(telefonos, { transaction });

    //------ Creo los emails
    const emails = newPersona.emails.map(e => {
      return {
        ...e,
        personaId: personaCreated.personaId
      };
    });

    await Email.bulkCreate(emails, { transaction });


    //------------Creo las situaciones
    //obtengo situaciones
    const situaciones = newPersona.situacionesTerapeuticas || []
    
    //Asocio a la persona
    const situacionesAsociadas = situaciones.map(s=>{
      return {
        ...s,
        personaId: personaCreated.personaId
      }
    })

    //Creo las situaciones
    await SituacionPersona.bulkCreate(situacionesAsociadas,{transaction})


    // Si todo salió bien, confirmo la transacción
    await transaction.commit();

    //Retorno
    res.status(201).json(personaCreated);

  } catch (error) {
    // Si algo falla, hago rollback
    await transaction.rollback();
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

        res.status(200).json(deleted);
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
