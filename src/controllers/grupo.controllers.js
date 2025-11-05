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
const {crearNumeroDeGrupo} = require('../utils/crearNumeroDeGrupo');
const redis = require('../db/config/redis.js')

//----------------------------GETTERS -------------------

//Todos los grupos
const getGrupos = async (_, res) => {
  try {
    const key = 'grupo:list:all';
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
    redis.set(key, JSON.stringify(gruposFormateado), { EX: process.env.CACHE_TTL });
    //Devuelvo todos los grupos
    res.status(200).json(gruposFormateado);
  } catch (error) {
    console.error(`Error al obtener todos los grupos: ${error}`);
    res.status(500).json({ error: "Error al obtener todos los grupos" });
  }
};
//Un Grupo
const getGrupoByPk = async(req,res) => {
  const {id} = req.params
  try {
    const key = `grupo:${id}`;
    //Consulta a la base de datos
    const grupoBuscado = await Grupo.findByPk(id,{
      include:[
        {
          model:PlanMedico,
          as:'planMedico'
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
      order: [
        [{ model: Persona, as: 'integrantes' }, 'credencial', 'DESC']
      ]
    })
    //Formateo
    const grupoFormateado = {
      ... grupoBuscado.toJSON(),
      integrantes:grupoBuscado.integrantes.map(i => {
          return {... i.toJSON(),
            situacionesTerapeuticas:formatearSituaciones(i.situacionesTerapeuticas)
          }
        }
      )
    }
    redis.set(key, JSON.stringify(grupoFormateado), { EX: process.env.CACHE_TTL });
    //Retorno
    res.json(grupoFormateado)
  } catch (error) {
    console.error(`Error al obtener el grupo: ${error}`);
    res.status(500).json({ error: "Error al obtener el grupo" });
  }
}


//----------------------------POST

const createGrupo = async (req, res) => {
  try {
    //Obtengo datos de nuevo grupo
    const newGrupo = req.body;

    //-----------------Creo el numero de grupo
    //Obtengo la cantidad de grupos
    const nroGrupoMasGrande = await Grupo.max('nroGrupo')
    //Creo el numero
    const nroGrupo = crearNumeroDeGrupo(nroGrupoMasGrande)
    //Agrego el numero al grupo
    newGrupo.nroGrupo = nroGrupo
    
    const grupoCreated = await Grupo.create(newGrupo);
    res.status(200).json(grupoCreated);
  } catch (error) {
    console.error(`Error al crear un grupo: ${error}`);
    res.status(500).json({ message: "Error en el servidor al crear un grupo" });
  }
};

//----------------------------DELETE
const deleteGrupo = async(req,res)=>{
  const {id} = req.params
  try {
    const grupoEliminado = await Grupo.destroy({
      where: {
        idGrupo:id
      }
    }) 
    if(grupoEliminado ===1){
      res.status(200).json(grupoEliminado)
    }else{
      res.status(404).json({error:'No se encontró el Grupo'})
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({error:'Error al eliminar el grupo'})
  }
}

//----------------------------PUT
const actualizarGrupo = async(req,res)=>{
  const {id} = req.params
  const body = req.body
  try {
    //Busco el grupo
    const grupoParaActualizar = await Grupo.findByPk(id)
    grupoParaActualizar.planId = body.planId
    grupoParaActualizar.fechaAlta = new Date(`${body.fechaAlta}T00:00:00`)
    grupoParaActualizar.fechaBaja = body.fechaBaja === '' ? null : new Date(`${body.fechaBaja}T00:00:00`)
    
    //Guardo los cabios
    await grupoParaActualizar.save()

    //Recargo
    await grupoParaActualizar.reload({
      include: [
        { model: PlanMedico, as: "planMedico" }
      ]
    });
    res.json(grupoParaActualizar)
  } catch (error) {
    console.error(error)
    res.status(500).json({message:'Error En el servidor'})
  }
}
module.exports = { 
  createGrupo, 
  getGrupos,
  getGrupoByPk,
  deleteGrupo,
  actualizarGrupo
};
