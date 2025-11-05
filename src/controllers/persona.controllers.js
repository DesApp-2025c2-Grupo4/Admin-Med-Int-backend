const { Persona, Grupo,SituacionPersona, PlanMedico, Telefono, Email, Direccion, SituacionesTerapeuticas,TipoDocumento } = require('../db/models');
const { crearCredencial } = require('../utils/crearCredencial');
const {formatearSituaciones} = require('../utils/formatearSituaciones')
const { sequelize } = require('../db/models');
const { Op } = require('sequelize')
const redis = require('../db/config/redis.js')

//----------------------------GETTERS
const getPersonas = async (_, res) => {
  try {
    const key = 'persona:list:all';
    const personas = await Persona.findAll({
      include: [
        {
          model: Grupo,
          as:'grupo',
          include: [
            {
              model: PlanMedico,
              as:'planMedico'
            },
          ],
        },
        {
          model: Email,
          as: 'email'
        }
      ],
    });
    redis.set(key, JSON.stringify(personas), { EX: 900 });
    res.status(200).json(personas);
  } catch (error) {
    console.error(`Error al obtener todas las personas: ${error}`);
    res.status(500).json({ error: "Error al obtener todas las personas" });
  }
};
//Obtener una persona
const getPersonaByPk = async (req,res)=>{
  try {
    const key = `persona:${id}`;
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
    redis.set(key, JSON.stringify(personaFormateada), { EX: 900 });
    //Retorno
    res.json(personaFormateada)
  } catch (error) {
    console.error(`Error al obtener la persona: ${error}`);
    res.status(500).json({ error: "Error al obtener una Persona" });
  }
}
//Obtener los afiliados
const getAfiliados = async(_,res)=>{
  try {
    const key = 'afiliado:list:all';
    const afiliados = await Persona.findAll(
      {
        where:{
          esTitular:true
        },
        include: [
        {
          model: Grupo,
          as:'grupo',
          include: [
            {
              model: PlanMedico,
              as:'planMedico'
            },
          ],
        },
        {
          model: Email,
          as: 'email'
        }]
      },
    )
    redis.set(key, JSON.stringify(afiliados), { EX: 900 });
    res.json(afiliados)
  } catch (error) {
    console.log(error)
    res.status(500).json({message:'Error al obtener los afiliados'})
  }
}
//----------------------------- Post
const createPersona = async (req, res) => {
  //Creo una transaccion en caso de que alguna consulta falle
  const transaction = await sequelize.transaction();
  try {

    //Obtengo datos del body
    const newPersona = req.body;
    console.log('Nueva Persona: ' + newPersona)

    //------------------- Creo la Credencial
    const grupo = await Grupo.findByPk(newPersona.idGrupo, { transaction });

    const ultimoIntegrante = await Persona.max('credencial',{
      where: { idGrupo: newPersona.idGrupo },
      transaction
    });
    // Si no hay integrantes, usamos 0 como base
    const ultimoNumero = ultimoIntegrante ? Number(ultimoIntegrante.split('-')[1]) : 0;

    const credencial = crearCredencial(grupo.nroGrupo, ultimoNumero);

    newPersona.credencial = credencial;
    //Controlo que no sea haya o no un titular

    const cantidadIntegrantes = await Persona.count({
      where: { idGrupo: newPersona.idGrupo },
      transaction
    });
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
const actualizarPersona = async (req,res) => {
  const {id} = req.params
  const nuevosDatos = req.body
  try {
    //Busco la persona
    const personaActualizar = await Persona.findByPk(id)
    //Actualizo la persona
    personaActualizar.nombre = nuevosDatos.nombre
    personaActualizar.apellido = nuevosDatos.apellido
    personaActualizar.parentesco = personaActualizar.esTitular ? null : nuevosDatos.parentesco
    personaActualizar.dni = nuevosDatos.dni
    personaActualizar.fechaNacimiento = nuevosDatos.fechaNacimiento
    personaActualizar.fechaBaja = nuevosDatos.fechaBaja
    personaActualizar.tipoDocId = nuevosDatos.tipoDocId

    //Guardo los datos
    await personaActualizar.save()

    //Recargo y obtengo los datos
    await personaActualizar.reload({
      include: [
        {
          model: Grupo,
          as:'grupo',
          include: [
            {
              model: PlanMedico,
              as:'planMedico'
            },
          ],
        },
        {
          model: Email,
          as: 'email'
        }
      ],
    })
    //Retorno
    res.json(personaActualizar)
  } catch (error) {
    res.status(500).json({message:'Error al actualizar'})
  }
}

// obtener afiliados por período
const getAfiliadosPorPeriodo = async (req, res) => {
  try {
    const { fechaDesde, fechaHasta } = req.query;

    // Validación de fechas
    if (!fechaDesde || !fechaHasta) {
      return res.status(400).json({ error: 'fechaDesde y fechaHasta son requeridos' });
    }
    const key = `afiliado:list:periodo:${fechaDesde}:${fechaHasta}`;
    const desde = new Date(fechaDesde);
    const hasta = new Date(fechaHasta);

    if (isNaN(desde.getTime()) || isNaN(hasta.getTime()) || desde > hasta) {
      return res.status(400).json({ error: 'Fechas inválidas' });
    }

    //filtra por esTitular y fechaAlta
    const afiliadosFiltrados = await Persona.findAll({
      where: {
        esTitular: true,
        fechaAlta: {
          [Op.between]: [fechaDesde, fechaHasta]
        }
      },
      include: [
        {
          model: Grupo,
          as: 'grupo',
          include: [
            {
              model: PlanMedico,
              as: 'planMedico'
            },
          ],
        },
        {
          model: Email,
          as: 'email'
        }
      ],
    });
    redis.set(key, JSON.stringify(afiliadosFiltrados), { EX: 900 });
    res.json(afiliadosFiltrados);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error al obtener los afiliados por período' });
  }
};
module.exports = { 
  getPersonas, 
  createPersona, 
  deletePersona,
  getPersonaByPk,
  getAfiliados,
  actualizarPersona,
  getAfiliadosPorPeriodo
};
